import { FLOATING_POINT_CUTOFF, QUALITY_FRIENDLY_NAMES, RESULTS_ID, RECIPE_RESULTS_TABLE_ID } from './constants.js';

export function display_results(solver, vars) {
    let results_element = document.getElementById(RESULTS_ID);
    results_element.style.display = 'block'; // block isn't important, just making it not none

    let recipe_results_table = document.getElementById(RECIPE_RESULTS_TABLE_ID);
    recipe_results_table.innerHTML = '';
    for(const [variable_key, amount] of Object.entries(vars)) {
        if(solver.distinct_recipes.has(variable_key) && (Math.abs(amount) > FLOATING_POINT_CUTOFF)) {
            let row_element = document.createElement('tr');
            let distinct_recipe = solver.distinct_recipes.get(variable_key);

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
                .innerHTML = amount;

            recipe_results_table.appendChild(row_element);
        }
    }
}
