import { calculate_quality_probability_factor } from './util.js';

export function get_item_constraint_key(item_name, item_quality) {
    return `item=${item_name}__quality=${item_quality}`;
}

export function get_input_item_variable_key(item_constraint_key) {
    return `input_item_variable__${item_constraint_key}`;
}

export function get_item_constraints(item_constraint_keys, preferences) {
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

export function get_item_variable_coefficients(item_constraint_keys, recipe_variables, parsed_data, preferences) {
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
        for(let ingredient of recipe_data.ingredients) {
            let ingredient_item_constraint_key = get_item_constraint_key(ingredient.name, recipe_variable.ingredient_quality);
            let ingredient_item_coefficients = item_variable_coefficients.get(ingredient_item_constraint_key);
            ingredient_item_coefficients.set(recipe_variable.key, (-1.0)*ingredient.amount);
        }

        for(let result of recipe_data.results) {
            for(let ending_quality = recipe_variable.ingredient_quality; ending_quality <= preferences.max_quality_unlocked; ending_quality++) {
                let result_item_constraint_key = get_item_constraint_key(result.name, ending_quality);
                let total_prod_factor = 1.0 + (recipe_variable.num_prod_modules * preferences.prod_bonus);
                let total_quality_factor = calculate_quality_probability_factor(recipe_variable.ingredient_quality, ending_quality, preferences.max_quality_unlocked, recipe_variable.num_quality_modules*preferences.quality_probability);
                let total_result_amount = result.amount * total_prod_factor * total_quality_factor;
                let result_item_coefficients = item_variable_coefficients.get(result_item_constraint_key);
                result_item_coefficients.set(recipe_variable.key, total_result_amount);
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

export function get_variable_costs(recipe_variables, preferences) {
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
