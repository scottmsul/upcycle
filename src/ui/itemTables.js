import { INPUT_ITEMS_TABLE_ID, OUTPUT_ITEMS_TABLE_ID } from "./constants.js";
import { parsed_data, defaults } from "../data.js";
import { DistinctItem } from "../distinctItem.js";
import { new_quality_select_element } from "./quality.js";

export function display_item_table(table_id, data) {
    let table = window.document.getElementById(table_id);
    table.innerHTML = '';
    for(let [distinct_item, amount] of data) {
        add_table_row(table, distinct_item.item_key, distinct_item.item_quality, amount);
    }
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
    let data = [];
    let table = window.document.getElementById(table_id);
    for(let row of Array.from(table.children)) {
        //<tr><th><select>
        let item_id = row.children[0].firstChild.value;
        let quality = parseInt(row.children[1].firstChild.value);
        let distinct_item = new DistinctItem(item_id, quality);
        let amount = parseFloat(row.children[2].firstChild.value);
        data.push([distinct_item, amount]);
    }
    return data;
}

function add_table_row(table, item_id, quality, amount) {
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
        .appendChild(make_numeric_input(amount));

    let delete_element = row_element
        .appendChild(document.createElement('th'))
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
