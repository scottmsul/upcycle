import { INPUT_ITEMS_TABLE_ID, OUTPUT_ITEMS_TABLE_ID } from "./constants.js";
import { parsed_data, defaults } from "../data/spaceAge2.0.11.js";
import { get_distinct_item_key } from "../distinctItem.js";

export function add_input_item() {
    let table = window.document.getElementById(INPUT_ITEMS_TABLE_ID);
    let item_keys = parsed_data.items.keys();
    let default_input_item_id = defaults.INPUT_ITEM_ID;
    let default_input_quality = defaults.INPUT_ITEM_QUALITY;
    let default_input_cost = defaults.INPUT_ITEM_COST;
    add_table_row(table, item_keys, default_input_item_id, default_input_quality, default_input_cost);
}

export function add_output_item() {
    let table = window.document.getElementById(OUTPUT_ITEMS_TABLE_ID);
    let item_keys = parsed_data.items.keys();
    let default_output_item_id = defaults.OUTPUT_ITEM_ID;
    let default_output_quality = defaults.OUTPUT_ITEM_QUALITY;
    let default_output_amount_per_second = defaults.OUTPUT_AMOUNT_PER_SECOND
    add_table_row(table, item_keys, default_output_item_id, default_output_quality, default_output_amount_per_second);
}

export function get_item_table_data(table_id) {
    let data = new Map();
    let table = window.document.getElementById(table_id);
    for(let row of Array.from(table.children)) {
        //<tr><th><select>
        let item_id = row.children[0].firstChild.value;
        let quality = row.children[1].firstChild.value;
        let amount = row.children[2].firstChild.value;
        let key = get_distinct_item_key(item_id, quality);
        data.set(key, amount);
    }
    return data;
}

function add_table_row(table, item_keys, default_item_id, default_quality, default_amount) {
    let row_element = document.createElement('tr');

    row_element
        .appendChild(document.createElement('th'))
        .appendChild(make_item_select(item_keys, default_item_id));

    // todo: get this "4" from max quality unlocked
    row_element
        .appendChild(document.createElement('th'))
        .appendChild(make_quality_select(4, default_quality));

    row_element
        .appendChild(document.createElement('th'))
        .appendChild(make_numeric_input(default_amount));

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

function make_quality_select(max_quality_unlocked, default_quality) {
    let select_element = document.createElement('select');
    for(let quality = 0; quality <= max_quality_unlocked; quality++) {
        let opt = document.createElement("option");
        opt.value = quality;
        opt.innerHTML = quality; //todo: make this a name
        select_element.append(opt);
    }
    select_element.value = default_quality;
    return select_element;
}

function make_numeric_input(default_value) {
    let input_element = document.createElement('input');
    input_element.setAttribute('type', 'number');
    input_element.value = default_value;
    return input_element;
}
