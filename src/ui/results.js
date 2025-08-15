import { FLOATING_POINT_CUTOFF, QUALITY_FRIENDLY_NAMES, RESULTS_ID, RECIPE_RESULTS_TABLE_ID, INPUT_ITEMS_TABLE_ID, INPUT_RESULTS_TABLE_ID, BYPRODUCT_RESULTS_SECTION_ID, BYPRODUCT_RESULTS_TABLE_ID } from './constants.js';

export function display_results(preferences, solver, vars) {
    let results_element = document.getElementById(RESULTS_ID);
    results_element.style.display = 'block'; // block isn't important, just making it not none

    let recipe_results_table = document.getElementById(RECIPE_RESULTS_TABLE_ID);
    recipe_results_table.innerHTML = '';

    let input_results_data = new Map();
    let byproduct_results_data = new Map();
    let recipe_results_data = new Map();
    for(const [variable_key, amount] of Object.entries(vars)) {
        if(Math.abs(amount) > FLOATING_POINT_CUTOFF) {
            if(solver.distinct_items.has(variable_key)) {
                if(preferences.inputs.has(variable_key)) {
                    input_results_data.set(variable_key, amount);
                } else {
                    byproduct_results_data.set(variable_key, amount);
                }
            } else if(solver.distinct_recipes.has(variable_key)) {
                recipe_results_data.set(variable_key, amount);
            }
        }
    }

    let input_results_table = document.getElementById(INPUT_RESULTS_TABLE_ID);
    input_results_table.innerHTML = '';
    input_results_data.forEach((amount, distinct_item_key, map) => {
        let unit_cost = solver.variable_costs.get(distinct_item_key);
        let row_element = document.createElement('tr');
        let distinct_item = solver.distinct_items.get(distinct_item_key);

        row_element
            .appendChild(document.createElement('td'))
            .innerHTML = distinct_item.item_key;

        row_element
            .appendChild(document.createElement('td'))
            .innerHTML = QUALITY_FRIENDLY_NAMES[distinct_item.item_quality];

        row_element
            .appendChild(document.createElement('td'))
            .innerHTML = amount;

        row_element
            .appendChild(document.createElement('td'))
            .innerHTML = unit_cost;

        row_element
            .appendChild(document.createElement('td'))
            .innerHTML = amount*unit_cost;

        input_results_table.appendChild(row_element);
    });

    let byproduct_results_section = document.getElementById(BYPRODUCT_RESULTS_SECTION_ID);
    if(byproduct_results_data.size > 0) {
        byproduct_results_section.style.display = 'block';
        byproduct_results_table.innerHTML = '';

        let byproduct_results_table = document.getElementById(BYPRODUCT_RESULTS_TABLE_ID);

        byproduct_results_data.forEach((amount, item_key, map) => {
            let row_element = document.createElement('tr');
            let distinct_item = solver.distinct_items.get(item_key);

            row_element
                .appendChild(document.createElement('td'))
                .innerHTML = distinct_item.item_key;

            row_element
                .appendChild(document.createElement('td'))
                .innerHTML = QUALITY_FRIENDLY_NAMES[distinct_item.item_quality];

            row_element
                .appendChild(document.createElement('td'))
                .innerHTML = amount;

            byproduct_results_table.appendChild(row_element);
        });
    } else {
        byproduct_results_section.style.display = 'none';
    }

    recipe_results_data.forEach((amount, distinct_recipe_key, map) => {
        let unit_cost = solver.variable_costs.get(distinct_recipe_key);

        let row_element = document.createElement('tr');
        let distinct_recipe = solver.distinct_recipes.get(distinct_recipe_key);

        row_element
            .appendChild(document.createElement('td'))
            .innerHTML = distinct_recipe.recipe_key;

        row_element
            .appendChild(document.createElement('td'))
            .innerHTML = QUALITY_FRIENDLY_NAMES[distinct_recipe.recipe_quality];

        row_element
            .appendChild(document.createElement('td'))
            .innerHTML = distinct_recipe.num_prod_modules;

        row_element
            .appendChild(document.createElement('td'))
            .innerHTML = distinct_recipe.num_quality_modules;

        row_element
            .appendChild(document.createElement('td'))
            .innerHTML = Math.ceil(distinct_recipe.num_beaconed_speed_modules/2);

        row_element
            .appendChild(document.createElement('td'))
            .innerHTML = distinct_recipe.num_beaconed_speed_modules;

        row_element
            .appendChild(document.createElement('td'))
            .innerHTML = amount;

        row_element
            .appendChild(document.createElement('td'))
            .innerHTML = unit_cost;

        row_element
            .appendChild(document.createElement('td'))
            .innerHTML = amount*unit_cost;

        recipe_results_table.appendChild(row_element);
    });
}
