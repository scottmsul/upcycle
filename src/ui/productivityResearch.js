import { PRODUCTIVITY_RESEARCH_ITEM_RECIPE_MAP } from "../data.js";
import { DEFAULT_PRODUCTIVITY_RESEARCH_AMOUNT } from "../model/constants.js";
import { int_from_string } from "../util.js";
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
        let amount = parseInt(row.children[1].firstChild.value);
        data.set(item_key, amount);
    }
    return data;
}

export function set_productivity_research_table_data(data) {
    let table = window.document.getElementById(PRODUCTIVITY_RESEARCH_TABLE_ID);
    for(let row of Array.from(table.children)) {
        //<tr><td>
        let item_key = row.children[0].innerHTML;
        let new_amount = data.get(item_key);
        //<tr><td><input>
        row.children[1].firstChild.value = new_amount;
    }
}

// returns null if not valid
// sets bad values to 0
export function productivity_research_from_string(s) {
    let input_obj = JSON.parse(s);
    if(!Array.isArray(input_obj)) return null;
    let input_map = new Map(input_obj);
    let output_map = new Map();
    for(let item_key of PRODUCTIVITY_RESEARCH_ITEM_RECIPE_MAP.keys()) {
        output_map.set(item_key, DEFAULT_PRODUCTIVITY_RESEARCH_AMOUNT);
        if(!input_map.has(item_key)) continue;
        let raw_input_amount = input_map.get(item_key);
        if(!(typeof raw_input_amount === 'number')) continue;
        let input_amount = Math.floor(raw_input_amount);
        if(input_amount < 0 || input_amount > 300) continue;
        output_map.set(item_key, input_amount);
    }
    return output_map;
}
