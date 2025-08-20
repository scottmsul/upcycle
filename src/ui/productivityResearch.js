import { PRODUCTIVITY_RESEARCH_ITEM_RECIPE_MAP } from "../data.js";
import { PRODUCTIVITY_RESEARCH_TABLE_ID } from "./constants.js";

export function initialize_productivity_research() {
    let productivity_research_table = window.document.getElementById(PRODUCTIVITY_RESEARCH_TABLE_ID);
    PRODUCTIVITY_RESEARCH_ITEM_RECIPE_MAP.forEach((recipe_keys, item_key, map) => {
        let row_element = document.createElement('tr');

        row_element
            .appendChild(document.createElement('td'))
            .innerHTML = item_key;

        let input_element = row_element
            .appendChild(document.createElement('td'))
            .appendChild(document.createElement('input'));
        input_element.setAttribute('type', 'number');
        input_element.setAttribute('value', 0.0);

        productivity_research_table.appendChild(row_element);
    });
}

export function get_productivity_research_table_data() {
    let data = new Map();
    let table = window.document.getElementById(PRODUCTIVITY_RESEARCH_TABLE_ID);
    for(let row of Array.from(table.children)) {
        //<tr><td>
        let item_key = row.children[0].innerHTML;
        //<tr><td><input>
        let amount = parseFloat(row.children[1].firstChild.value)/100.0;
        let recipe_keys = PRODUCTIVITY_RESEARCH_ITEM_RECIPE_MAP.get(item_key);
        for(let recipe_key of recipe_keys) {
            data.set(recipe_key, amount);
        }
    }
    return data;
}

