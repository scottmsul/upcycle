import { ITEM_SELECT_DATA } from "../data.js";
import { distinct_item_from_obj, DistinctItem } from "../distinctItem.js";
import { float_from_string } from "../util.js";
import { make_quality_select } from "./quality.js";
import { make_numeric_input } from "./util.js";

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
        //<tr><td><select>
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

    row_element
        .appendChild(document.createElement('td'))
        .appendChild(make_item_select(item_id));

    row_element
        .appendChild(document.createElement('td'))
        .appendChild(make_quality_select(quality));

    row_element
        .appendChild(document.createElement('td'))
        .appendChild(make_numeric_input(amount));

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

function make_item_select(default_item_id) {
    let select_element = document.createElement('select');
    for(let item_data of ITEM_SELECT_DATA) {
        let opt = document.createElement("option");
        opt.value = item_data.item_key;
        opt.innerHTML = item_data.localized_name;
        select_element.append(opt);
    }
    select_element.value = default_item_id;
    return select_element;
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
