
import { parsed_data } from "../data.js";
import { RECIPES_TABLE_ID } from "./constants.js";

export function display_recipe_table(data) {
    let table = window.document.getElementById(RECIPES_TABLE_ID);
    table.innerHTML = '';
    for(let recipe_key of data) {
        add_recipe_table_row(recipe_key);
    }
}

export function get_recipe_table_data() {
    let data = [];
    let table = window.document.getElementById(RECIPES_TABLE_ID);
    for(let row of Array.from(table.children)) {
        //<tr><td><select>
        let recipe_key = row.children[0].firstChild.value;
        data.push(recipe_key);
    }
    return data;
}

export function add_recipe_table_row(recipe_key) {
    let table = window.document.getElementById(RECIPES_TABLE_ID);
    let row_element = document.createElement('tr');
    let recipe_keys = parsed_data.recipes.keys();

    row_element
        .appendChild(document.createElement('td'))
        .appendChild(make_recipe_select(recipe_keys, recipe_key));

    let delete_element = row_element
        .appendChild(document.createElement('td'))
        .appendChild(document.createElement('button'));
    delete_element.innerHTML = 'x';

    table.appendChild(row_element);
    delete_element.onclick = () => {
        table.removeChild(row_element);
        // by deleting a row we've changed the table, this lets the controller know to update state
        let event = new Event('change');
        table.dispatchEvent(event);
    };

    // by adding a row we've changed the table, this lets the controller know to update state
    let event = new Event('change');
    table.dispatchEvent(event);
}

function make_recipe_select(recipe_keys, default_recipe_key) {
    let select_element = document.createElement('select');
    for(let recipe_key of recipe_keys) {
        let opt = document.createElement("option");
        opt.value = recipe_key;
        opt.innerHTML = recipe_key;
        select_element.append(opt);
    }
    select_element.value = default_recipe_key;
    return select_element;
}

// returns null if not valid
export function recipes_from_string(s) {
    let input_obj = JSON.parse(s);
    if(!Array.isArray(input_obj)) return null;
    let output_obj = [];
    for(let recipe_key of input_obj) {
        if(!parsed_data.recipes.has(recipe_key)) continue;
        output_obj.push(recipe_key);
    }
    return output_obj;
}
