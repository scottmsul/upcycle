import { DistinctItem } from "./distinctItem.js";

const INPUT_ITEM_SELECT_ID = "input-item";
const INPUT_QUALITY_SELECT_ID = "input-quality";
const OUTPUT_ITEM_SELECT_ID = "output-item";
const OUTPUT_QUALITY_SELECT_ID = "output-quality";
const RESULT_ID = 'result';

export function initialize_ui(parsed_data, defaults) {
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

export function get_input_distinct_item() {
    let input_item_key = get_select_value(INPUT_ITEM_SELECT_ID);
    let input_item_quality = get_select_value(INPUT_QUALITY_SELECT_ID);
    let input_distinct_item = new DistinctItem(input_item_key, input_item_quality);
    return input_distinct_item;
}

export function get_output_distinct_item() {
    let output_item_key = get_select_value(OUTPUT_ITEM_SELECT_ID);
    let output_item_quality = get_select_value(OUTPUT_QUALITY_SELECT_ID);
    let output_distinct_item = new DistinctItem(output_item_key, output_item_quality);
    return output_distinct_item;
}

function get_select_value(select_id) {
    return document.getElementById(select_id).value;
}

export function display_result(vars) {
    let result = document.getElementById(RESULT_ID);
    result.innerHTML = "";
    for(const [variable_key, amount] of Object.entries(vars)) {
        if(amount != 0) {
            let curr_line = document.createElement("div");
            curr_line.innerHTML = `${variable_key}: ${amount}`;
            result.appendChild(curr_line);
        }
    }
}
