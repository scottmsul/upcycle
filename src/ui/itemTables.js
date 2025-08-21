import { INPUT_ITEMS_TABLE_ID, OUTPUT_ITEMS_TABLE_ID } from "./constants.js";
import { parsed_data, defaults } from "../data.js";
import { get_distinct_item_key, parse_distinct_item_key } from "../distinctItem.js";
import { new_quality_select_element } from "./quality.js";

export function display_item_table(table_id, distinct_item_cost_map) {
    let table = window.document.getElementById(table_id);
    table.innerHTML = '';
    distinct_item_cost_map.forEach((cost, distinct_item_key, map) => {
        let distinct_item = parse_distinct_item_key(distinct_item_key);
        add_table_row(table, distinct_item.item_key, distinct_item.item_quality, cost);
    });
}

export function add_input_item() {
    let table = window.document.getElementById(INPUT_ITEMS_TABLE_ID);
    let default_input_item_id = defaults.INPUT_ITEM_ID;
    let default_input_quality_type = defaults.INPUT_ITEM_QUALITY_TYPE;
    let default_input_cost = defaults.INPUT_ITEM_COST;
    add_table_row(table, default_input_item_id, default_input_quality_type, default_input_cost);
}

export function add_output_item() {
    let table = window.document.getElementById(OUTPUT_ITEMS_TABLE_ID);
    let default_output_item_id = defaults.OUTPUT_ITEM_ID;
    let default_output_quality_type = defaults.OUTPUT_ITEM_QUALITY_TYPE;
    let default_output_amount_per_second = defaults.OUTPUT_AMOUNT_PER_SECOND
    add_table_row(table, default_output_item_id, default_output_quality_type, default_output_amount_per_second);
}

export function get_item_table_data(table_id) {
    let data = new Map();
    let table = window.document.getElementById(table_id);
    for(let row of Array.from(table.children)) {
        //<tr><th><select>
        let item_id = row.children[0].firstChild.value;
        let quality = parseInt(row.children[1].firstChild.value);
        let amount = parseFloat(row.children[2].firstChild.value);
        let key = get_distinct_item_key(item_id, quality);
        data.set(key, amount);
    }
    return data;
}

function add_table_row(table, item_id, quality, cost) {
    let row_element = document.createElement('tr');
    let item_keys = parsed_data.items.keys();

    row_element
        .appendChild(document.createElement('th'))
        .appendChild(make_item_select(item_keys, item_id));

    row_element
        .appendChild(document.createElement('th'))
        .appendChild(new_quality_select_element(quality));

    row_element
        .appendChild(document.createElement('th'))
        .appendChild(make_numeric_input(cost));

    let delete_element = row_element
        .appendChild(document.createElement('th'))
        .appendChild(document.createElement('button'));
    delete_element.innerHTML = 'x';

    table.appendChild(row_element);
    delete_element.onclick = () => { table.removeChild(row_element); };
}

function make_item_select(item_keys, default_item_id) {
    let select_element = document.createElement('select');
    for(let item_key of item_keys) {
        let opt = document.createElement("option");
        opt.value = item_key;
        opt.innerHTML = item_key;
        select_element.append(opt);
    }
    select_element.value = default_item_id;
    return select_element;
}

function make_numeric_input(default_value) {
    let input_element = document.createElement('input');
    input_element.setAttribute('type', 'number');
    input_element.value = default_value;
    return input_element;
}
