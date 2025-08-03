import { get_item_constraint_key } from "./solver.js";
import { defaults } from "./data/spaceAge2.0.11.js";

export const INPUT_ITEM_SELECT_ID = "input-item";
export const INPUT_QUALITY_SELECT_ID = "input-quality";
export const OUTPUT_ITEM_SELECT_ID = "output-item";
export const OUTPUT_QUALITY_SELECT_ID = "output-quality";

export function initialize_ui(parsed_data) {
    let item_keys = Array.from(parsed_data.items.keys());
    let max_quality_unlocked = 4; // todo: make this an option
    initialize_item_select(item_keys, INPUT_ITEM_SELECT_ID, defaults.INPUT_ITEM_ID);
    initialize_quality_select(max_quality_unlocked, INPUT_QUALITY_SELECT_ID, defaults.INPUT_ITEM_QUALITY);
    initialize_item_select(item_keys, OUTPUT_ITEM_SELECT_ID, defaults.OUTPUT_ITEM_ID);
    initialize_quality_select(max_quality_unlocked, OUTPUT_QUALITY_SELECT_ID, defaults.OUTPUT_ITEM_QUALITY);
}

function initialize_item_select(item_keys, select_id, default_item_id) {
    let select = window.document.getElementById(select_id);
    for(let item_key of item_keys) {
        let opt = document.createElement("option");
        opt.value = item_key;
        opt.innerHTML = item_key;
        select.append(opt);
    }
    select.value = default_item_id;
}

function initialize_quality_select(max_quality_unlocked, select_id, default_quality) {
    let select = window.document.getElementById(select_id);
    for(let quality = 0; quality <= max_quality_unlocked; quality++) {
        let opt = document.createElement("option");
        opt.value = quality;
        opt.innerHTML = quality; //todo: make this a name
        select.append(opt);
    }
    select.value = default_quality;
}

export function get_input_item_constraint_key() {
    let input_item_key = get_select_value(INPUT_ITEM_SELECT_ID);
    let input_item_quality = get_select_value(INPUT_QUALITY_SELECT_ID);
    let input_item_constraint_key = get_item_constraint_key(input_item_key, input_item_quality);
    return input_item_constraint_key;
}

export function get_output_item_constraint_key() {
    let output_item_key = get_select_value(OUTPUT_ITEM_SELECT_ID);
    let output_item_quality = get_select_value(OUTPUT_QUALITY_SELECT_ID);
    let output_item_constraint_key = get_item_constraint_key(output_item_key, output_item_quality);
    return output_item_constraint_key;
}

function get_select_value(select_id) {
    return document.getElementById(select_id).value;
}
