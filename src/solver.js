/**
 * This file contains the meat-and-potatoes of setting up the solver.
 * At a high level, any linear solver has two main "things": variables and constraints.
 * The goal of this file is to build up a Solver object from a ParsedData object,
 * with the Solver object containing all the variables and constraints needed to run a solver.
 * The job of actually translating this data into a specific packaged solver format is handled elsewhere.
 */
import { DistinctItem, get_distinct_item_key } from './distinctItem.js';
import { DistinctRecipe } from './distinctRecipe.js';
import { calculate_expected_result_amount, calculate_quality_transition_probability, calculate_recipe_modifiers  } from './util.js';

export class Solver {
    constructor(parsed_data, preferences) {
        this.distinct_items = get_all_distinct_items(parsed_data, preferences);
        this.distinct_recipes = get_all_distinct_recipes(parsed_data, preferences);
        this.distinct_item_constraints = get_distinct_item_constraints(this.distinct_items, preferences);
        this.item_variable_coefficients = get_item_variable_coefficients(this.distinct_items, this.distinct_recipes, parsed_data, preferences);
        this.variable_costs = get_variable_costs(this.distinct_items, this.distinct_recipes, preferences);
    }
}

function get_all_distinct_items(parsed_data, preferences) {
    /**
     * An item constraint key is a unique item in the solver.
     * Generally this will be an item_id combined with a quality level.
     * Returns a set of all solver item constraint keys reachable from the given recipes.
     * Best to not use data.items because it contains some unproducible things.
     * Could be optimized to exclude unreachable recipes given a user's settings.
     */
    let distinct_items = new Map();
    parsed_data.recipes.forEach( (recipe_data, recipe_key, map) => {
        for(let ingredient of recipe_data.ingredients) {
            let max_allowed_quality = parsed_data.items.get(ingredient.name).allows_quality ? preferences.max_quality_unlocked : 0;
            for(let quality = 0; quality <= max_allowed_quality; quality++) {
                let distinct_item = new DistinctItem(ingredient.name, quality);
                distinct_items.set(distinct_item.key, distinct_item);
            }
        }
        for(let result of recipe_data.results) {
            let max_allowed_quality = parsed_data.items.get(result.name).allows_quality ? preferences.max_quality_unlocked : 0;
            for(let quality = 0; quality <= max_allowed_quality; quality++) {
                let distinct_item = new DistinctItem(result.name, quality);
                distinct_items.set(distinct_item.key, distinct_item);
            }
        }
    });
    return distinct_items;
}

function get_all_distinct_recipes(parsed_data, preferences) {
    /**
     * Returns a map data structure containing all distinct recipes for this solve.
     * Keys are distinct recipe keys, values are distinct recipe objects.
     * In this context, each returned recipe will correspond to a single solver variable,
     * which represent every unique combination of input quality and prod/qual modules.
     * We don't bother checking empty module slots or module slots with speed modules,
     * even though in some cases these might be optimal, due to the combinatorial blow-up.
     * If a recipe doesn't allow productivity, we always max it out with quality modules.
     * This function is mainly for identifying all the different combinations,
     * with the logic for calculating true input/output amounts and solver costs later on.
     * Fluid handling to be added later.
     */
    let distinct_recipes = new Map();
    parsed_data.recipes.forEach( (recipe_data, recipe_key, map) => {
        let crafting_machine_key = preferences.preferred_crafting_machine_by_category.get(recipe_data.category);
        let crafting_machine_data = parsed_data.crafting_machines.get(crafting_machine_key);
        let num_module_slots = crafting_machine_data.module_slots;
        let max_recipe_quality = recipe_data.ingredients.some(o => parsed_data.items.get(o.name).allows_quality) ? preferences.max_quality_unlocked : 0;
        for(let recipe_quality = 0; recipe_quality <= max_recipe_quality; recipe_quality++) {
            let num_allowed_prod_modules = recipe_data.allow_productivity ? num_module_slots : 0;
            for(let num_prod_modules = 0; num_prod_modules <= num_allowed_prod_modules; num_prod_modules++) {
                let num_quality_modules = num_module_slots - num_prod_modules;
                for(let num_beaconed_speed_modules = 0; num_beaconed_speed_modules <= preferences.max_beaconed_speed_modules; num_beaconed_speed_modules++) {
                    let distinct_recipe = new DistinctRecipe(recipe_key, recipe_quality, num_prod_modules, num_quality_modules, num_beaconed_speed_modules);
                    distinct_recipes.set(distinct_recipe.key, distinct_recipe);
                }
            }
        }
    })
    return distinct_recipes;
}

function get_distinct_item_constraints(distinct_items, preferences) {
    /**
     * A map whose keys are solver item keys and whose values are amounts.
     * Essentially if we're solving the matrix equation Ax=b, this sets up b.
     * By default all items are constrained to zero,
     * except net outputs whihch are set to their desired output value.
     * For items that are allowed to be inputs or byproducts to the system,
     * we set these up with additional (column) variables constrained in the desired direciton.
     */
    let distinct_item_constraints = new Map();
    for(let distinct_item_key of distinct_items.keys()) {
        let constraint_value = preferences.outputs.get(distinct_item_key) || 0.0;
        distinct_item_constraints.set(distinct_item_key, constraint_value);
    }
    return distinct_item_constraints;
}

function get_item_variable_coefficients(distinct_items, distinct_recipes, parsed_data, preferences) {
    /**
     * A map whose keys are all the distinct item keys and whose values are another map.
     * The pointed-to map's keys are variable keys and the values are amounts.
     * This data structure specifies how much each item is produced or consumed by each unit of a given variable.
     * This function also performs the logical work of computing ingredient and result amounts
     * given the various influencing factors such as different modules, beacons, etc.
     */
    let item_variable_coefficients = new Map();
    for(let distinct_item_key of distinct_items.keys()) {
        item_variable_coefficients.set(distinct_item_key, new Map());
    }

    distinct_recipes.forEach((distinct_recipe, distinct_recipe_key, map) => {
        let recipe_data = parsed_data.recipe(distinct_recipe.recipe_key);

        let recipe_modifiers = calculate_recipe_modifiers(distinct_recipe, parsed_data, preferences);
        let speed_factor = recipe_modifiers.speed_factor;
        let quality_percent = recipe_modifiers.quality_percent;
        let prod_bonus = recipe_modifiers.prod_bonus;

        for(let ingredient_data of recipe_data.ingredients) {
            let item_data = parsed_data.items.get(ingredient_data.name);
            let ingredient_quality = item_data.allows_quality ? distinct_recipe.recipe_quality : 0;
            let ingredient_amount_per_second_per_machine = speed_factor * ingredient_data.amount / recipe_data.energy_required;

            let ingredient_distinct_item_key = get_distinct_item_key(ingredient_data.name, ingredient_quality);
            let ingredient_item_coefficients = item_variable_coefficients.get(ingredient_distinct_item_key);
            let curr_coefficient = ingredient_item_coefficients.get(distinct_recipe_key) || 0.0;
            let new_coefficient = curr_coefficient - ingredient_amount_per_second_per_machine;
            ingredient_item_coefficients.set(distinct_recipe_key, new_coefficient);
        }

        for(let result_data of recipe_data.results) {
            let item_data = parsed_data.items.get(result_data.name);
            let starting_quality = item_data.allows_quality ? distinct_recipe.recipe_quality : 0;
            let min_ending_quality = item_data.allows_quality ? distinct_recipe.recipe_quality : 0;
            let max_ending_quality = item_data.allows_quality ? preferences.max_quality_unlocked : 0;
            for(let ending_quality = min_ending_quality; ending_quality <= max_ending_quality; ending_quality++) {
                let quality_transition_probability = calculate_quality_transition_probability(starting_quality, ending_quality, preferences.max_quality_unlocked, quality_percent);
                let expected_result_amount = calculate_expected_result_amount(result_data, prod_bonus);
                let result_amount_per_second_per_machine = speed_factor * expected_result_amount * quality_transition_probability / recipe_data.energy_required;

                let result_distinct_item_key = get_distinct_item_key(result_data.name, ending_quality);
                let result_item_coefficients = item_variable_coefficients.get(result_distinct_item_key);
                let curr_coefficient = result_item_coefficients.get(distinct_recipe_key) || 0.0;
                let new_coefficient = curr_coefficient + result_amount_per_second_per_machine;
                result_item_coefficients.set(distinct_recipe_key, new_coefficient);
            }
        }
    });

    // for each unit of an input free variable, we make 1 unit of that item
    // we use the input cost data structure to determine what the inputs are,
    // even though we don't require the actual cost value here
    preferences.inputs.forEach( (cost, disinct_item_key, map) => {
        let input_item_coefficients = item_variable_coefficients.get(disinct_item_key);
        input_item_coefficients.set(disinct_item_key, 1.0);
    });

    // if we allow byproducts then every single (non-input) item needs a variable which voids it
    if(preferences.allow_byproducts) {
        distinct_items.forEach( (distinct_item, distinct_item_key, map) => {
            if(!preferences.inputs.has(distinct_item_key)) {
                let byproduct_item_coefficients = item_variable_coefficients.get(distinct_item_key);
                byproduct_item_coefficients.set(distinct_item_key, -1.0);
            }
        });
    }

    return item_variable_coefficients;
}

function get_variable_costs(distinct_items, distinct_recipes, preferences) {
    let variable_costs = new Map();

    // input item variable costs
    preferences.inputs.forEach( (cost, disinct_item_key, map) => {
        variable_costs.set(disinct_item_key, cost);
    });

    // if we allow byproducts then these get voided for free
    if(preferences.allow_byproducts) {
        distinct_items.forEach( (distinct_item, distinct_item_key, map) => {
            if(!preferences.inputs.has(distinct_item_key)) {
                variable_costs.set(distinct_item_key, 0.0);
            }
        });
    }

    // recipe variable costs
    distinct_recipes.forEach((distinct_recipe, distinct_recipe_key, map) => {
        let crafting_machine_unit_cost = preferences.crafting_machine_cost;
        let quality_module_unit_cost = distinct_recipe.num_quality_modules * preferences.quality_module_cost;
        let prod_module_unit_cost = distinct_recipe.num_prod_modules * preferences.prod_module_cost;
        let recipe_unit_cost = crafting_machine_unit_cost + quality_module_unit_cost + prod_module_unit_cost;
        variable_costs.set(distinct_recipe_key, recipe_unit_cost);
    });

    return variable_costs;
}
