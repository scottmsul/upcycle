import { RESULT_ID, RECIPE_RESULT_HEADERS, EPSILON, QUALITY_FRIENDLY_NAMES } from './constants.js';
import { append_new, append_new_set } from "./util.js";

export function display_result(solver, vars) {
    let result = document.getElementById(RESULT_ID);
    result.innerHTML = '';
    let table = append_new(result, 'table');
    let header_body = append_new(table, 'thead');
    let header_row = append_new(header_body, 'tr');
    for(let header_text of RECIPE_RESULT_HEADERS) {
        let header_col = append_new(header_row, 'th');
        header_col.innerHTML = header_text;
    }
    let table_body = append_new(table, 'tbody');
    for(const [variable_key, amount] of Object.entries(vars)) {
        if(solver.distinct_recipes.has(variable_key)) {
            if(Math.abs(amount) > EPSILON) {
                let table_row = append_new(table_body, 'tr');
                let distinct_recipe = solver.distinct_recipes.get(variable_key);

                append_new_set(table_row, 'td', distinct_recipe.recipe_key);
                append_new_set(table_row, 'td', QUALITY_FRIENDLY_NAMES[distinct_recipe.recipe_quality]);
                append_new_set(table_row, 'td', distinct_recipe.num_prod_modules);
                append_new_set(table_row, 'td', distinct_recipe.num_quality_modules);
                append_new_set(table_row, 'td', amount);
            }
        }
    }
}
