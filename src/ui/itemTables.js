import { parsed_data } from "../data.js";
import { distinct_item_from_obj, DistinctItem } from "../distinctItem.js";
import { float_from_string } from "../util.js";
import { initialize_quality_selector } from "./quality.js";

export function display_item_table(table_id, data) {
    let table = window.document.getElementById(table_id);
    table.innerHTML = '';
    for(let [distinct_item, amount] of data) {
        add_item_table_row(table_id, distinct_item.item_key, distinct_item.item_quality, amount);
    }
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

export function add_item_table_row(table_id, item_id, quality, amount) {
    let table = window.document.getElementById(table_id);
    let row_element = document.createElement('tr');
    let item_keys = parsed_data.items.keys();

    row_element
        .appendChild(document.createElement('th'))
        .appendChild(make_item_select(item_keys, item_id));

    row_element
        .appendChild(document.createElement('th'))
        .appendChild(make_quality_select(quality));

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

function make_quality_select(initial_quality) {
    let quality_select = document.createElement('select');
    initialize_quality_selector(quality_select);
    quality_select.value = initial_quality;
    return quality_select;
}

function make_numeric_input(default_value) {
    let input_element = document.createElement('input');
    input_element.setAttribute('type', 'number');
    input_element.value = default_value;
    return input_element;
}

// returns null if not valid
export function item_table_from_string(s) {
    let input_obj = JSON.parse(s);
    if(!Array.isArray(input_obj)) return null;
    let output_obj = [];
    for(let input_row of input_obj) {
        if((!Array.isArray(input_row)) || (input_row.length != 2)) continue;
        let distinct_item = distinct_item_from_obj(input_row[0]);
        let amount = float_from_string(input_row[1]);
        if((distinct_item === null) || (amount === null)) continue;
        let output_row = [distinct_item, amount];
        output_obj.push(output_row);
    }
    return output_obj;
}
