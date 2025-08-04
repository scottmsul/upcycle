/**
 * This file contains the meat-and-potatoes of setting up the solver.
 * At a high level, any linear solver has two main "things": variables and constraints.
 * The goal of this file is to build up a Solver object from a ParsedData object,
 * with the Solver object containing all the variables and constraints needed to run a solver.
 * The job of actually translating this data into a specific packaged solver format is handled elsewhere.
 */
import { calculate_expected_result_amount, calculate_quality_transition_probability } from './util.js';

export class Solver {
    constructor(parsed_data, preferences) {
        let item_constraint_keys = get_all_producible_item_constraint_keys(parsed_data, preferences);
        let recipe_variables = get_all_recipe_variables(parsed_data, preferences);
        let item_constraints = get_item_constraints(item_constraint_keys, preferences);
        let item_variable_coefficients = get_item_variable_coefficients(item_constraint_keys, recipe_variables, parsed_data, preferences);
        let variable_costs = get_variable_costs(recipe_variables, preferences);
        // things needed for glpk
        this.item_constraints = item_constraints;
        this.item_variable_coefficients = item_variable_coefficients;
        this.variable_costs = variable_costs;
    }
}

export function get_item_constraint_key(item_name, item_quality) {
    return `item=${item_name}__quality=${item_quality}`;
}

class RecipeVariable {
    constructor(recipe_key, recipe_quality, num_prod_modules, num_quality_modules) {
        this.recipe_key = recipe_key;
        this.recipe_quality = recipe_quality;
        this.num_prod_modules = num_prod_modules;
        this.num_quality_modules = num_quality_modules;
    }

    get key() {
        return `recipe_key=${this.recipe_key}__recipe_quality=${this.recipe_quality}__num_prod_modules=${this.num_prod_modules}__num_quality_modules=${this.num_quality_modules}`;
    }
}

function get_all_producible_item_constraint_keys(parsed_data, preferences) {
    /**
     * An item constraint key is a unique item in the solver.
     * Generally this will be an item_id combined with a quality level.
     * Returns a set of all solver item constraint keys reachable from the given recipes.
     * Best to not use data.items because it contains some unproducible things.
     * Could be optimized to exclude unreachable recipes given a user's settings.
     */
    let item_constraint_keys = new Set();
    parsed_data.recipes.forEach( (recipe_data, recipe_key, map) => {
        for(let ingredient of recipe_data.ingredients) {
            let max_allowed_quality = parsed_data.items.get(ingredient.name).allows_quality ? preferences.max_quality_unlocked : 0;
            for(let quality = 0; quality <= max_allowed_quality; quality++) {
                let item_constraint_key = get_item_constraint_key(ingredient.name, quality);
                item_constraint_keys.add(item_constraint_key);
            }
        }
        for(let result of recipe_data.results) {
            let max_allowed_quality = parsed_data.items.get(result.name).allows_quality ? preferences.max_quality_unlocked : 0;
            for(let quality = 0; quality <= max_allowed_quality; quality++) {
                let item_constraint_key = get_item_constraint_key(result.name, quality);
                item_constraint_keys.add(item_constraint_key);
            }
        }
    });
    return item_constraint_keys;
}

function get_all_recipe_variables(parsed_data, preferences) {
    /**
     * Returns a list of RecipeVariable objects
     * In this context, each returned recipe will correspond to a single solver variable,
     * which represent every unique combination of input quality and prod/qual modules.
     * We don't bother checking empty module slots or module slots with speed modules,
     * even though in some cases these might be optimal, due to the combinatorial blow-up.
     * If a recipe doesn't allow productivity, we always max it out with quality modules.
     * This function is mainly for identifying all the different combinations,
     * with the logic for calculating true input/output amounts and solver costs later on.
     * Fluid handling to be added later.
     */
    let recipe_variables = [];
    parsed_data.recipes.forEach( (recipe_data, recipe_key, map) => {
        let max_recipe_quality = recipe_data.ingredients.some(o => parsed_data.items.get(o.name).allows_quality) ? preferences.max_quality_unlocked : 0;
        for(let recipe_quality = 0; recipe_quality <= max_recipe_quality; recipe_quality++) {
            let num_allowed_prod_modules = recipe_data.allow_productivity ? preferences.num_module_slots : 0;
            for(let num_prod_modules = 0; num_prod_modules <= num_allowed_prod_modules; num_prod_modules++) {
                // todo: get num_module_slots from the actual building
                let num_quality_modules = preferences.num_module_slots - num_prod_modules;
                let recipe_variable = new RecipeVariable(recipe_key, recipe_quality, num_prod_modules, num_quality_modules);
                recipe_variables.push(recipe_variable);
            }
        }
    })
    return recipe_variables;
}

function get_input_item_variable_key(item_constraint_key) {
    return `input_item_variable__${item_constraint_key}`;
}

function get_item_constraints(item_constraint_keys, preferences) {
    /**
     * A map whose keys are solver item keys and whose values are amounts.
     * Essentially if we're solving the matrix equation Ax=b, this sets up b.
     * By default all items are constrained to zero,
     * except net outputs whihch are set to their desired output value.
     * For items that are allowed to be inputs or byproducts to the system,
     * we set these up with additional (column) variables constrained in the desired direciton.
     */
    let item_constraints = new Map();
    for(let item_constraint_key of item_constraint_keys) {
        let constraint_value = preferences.outputs.get(item_constraint_key) || 0.0;
        item_constraints.set(item_constraint_key, constraint_value);
    }
    return item_constraints;
}

function get_item_variable_coefficients(item_constraint_keys, recipe_variables, parsed_data, preferences) {
    /**
     * A map whose keys are solver item keys and whose values are another map.
     * The pointed-to map's keys are variable keys and the values are amounts.
     * This data structure specifies how much each item is produced or consumed by each unit of a given variable.
     * This function also performs the logical work of computing ingredient and result amounts
     * given the various influencing factors such as different modules, beacons, etc.
     */
    let item_variable_coefficients = new Map();
    for(let item_constraint_key of item_constraint_keys) {
        item_variable_coefficients.set(item_constraint_key, new Map());
    }

    for(let recipe_variable of recipe_variables) {
        let recipe_data = parsed_data.recipe(recipe_variable.recipe_key);
        for(let ingredient_data of recipe_data.ingredients) {
            let item_data = parsed_data.items.get(ingredient_data.name);
            let ingredient_quality = item_data.allows_quality ? recipe_variable.recipe_quality : 0;
            let ingredient_item_constraint_key = get_item_constraint_key(ingredient_data.name, ingredient_quality);
            let ingredient_item_coefficients = item_variable_coefficients.get(ingredient_item_constraint_key);
            // todo: add buildings
            let ingredient_amount_per_second_per_machine = ingredient_data.amount / recipe_data.energy_required;
            ingredient_item_coefficients.set(recipe_variable.key, (-1.0)*ingredient_amount_per_second_per_machine);
        }

        for(let result_data of recipe_data.results) {
            let item_data = parsed_data.items.get(result_data.name);
            let starting_quality = item_data.allows_quality ? recipe_variable.recipe_quality : 0;
            let min_ending_quality = item_data.allows_quality ? recipe_variable.recipe_quality : 0;
            let max_ending_quality = item_data.allows_quality ? preferences.max_quality_unlocked : 0;
            for(let ending_quality = min_ending_quality; ending_quality <= max_ending_quality; ending_quality++) {
                let result_item_constraint_key = get_item_constraint_key(result_data.name, ending_quality);
                let quality_percent = recipe_variable.num_quality_modules*preferences.quality_probability;
                let quality_transition_probability = calculate_quality_transition_probability(starting_quality, ending_quality, preferences.max_quality_unlocked, quality_percent);
                // todo: account for other prod bonuses
                let prod_bonus = recipe_variable.num_prod_modules * preferences.prod_bonus;
                let expected_result_amount = calculate_expected_result_amount(result_data, prod_bonus);
                // todo: add buildings
                let result_amount_per_second_per_machine = expected_result_amount * quality_transition_probability / recipe_data.energy_required;
                let result_item_coefficients = item_variable_coefficients.get(result_item_constraint_key);
                result_item_coefficients.set(recipe_variable.key, result_amount_per_second_per_machine);
            }
        }
    }

    // for each unit of an input free variable, we make 1 unit of that item
    // we use the input cost data structure to determine what the inputs are,
    // even though we don't require the actual cost value here
    preferences.inputs.forEach( (cost, input_item_constraint_key, map) => {
        let input_item_coefficients = item_variable_coefficients.get(input_item_constraint_key);
        let input_item_variable_key = get_input_item_variable_key(input_item_constraint_key);
        input_item_coefficients.set(input_item_variable_key, 1.0);
    });

    return item_variable_coefficients;
}

function get_variable_costs(recipe_variables, preferences) {
    let variable_costs = new Map();

    // input item variable costs
    preferences.inputs.forEach( (cost, item_constraint_key, map) => {
        let key = get_input_item_variable_key(item_constraint_key);
        variable_costs.set(key, cost);
    });

    // recipe variable costs
    for(let recipe_variable of recipe_variables) {
        variable_costs.set(recipe_variable.key, preferences.recipe_cost);
    }

    return variable_costs;
}
