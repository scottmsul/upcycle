import { DistinctItem } from '../distinctItem.js';
import { INPUT_ITEM_SELECT_ID, INPUT_QUALITY_SELECT_ID, OUTPUT_ITEM_SELECT_ID, OUTPUT_QUALITY_SELECT_ID } from './constants.js';
import { get_value } from './util.js';

export function get_input_distinct_item() {
    let input_item_key = get_value(INPUT_ITEM_SELECT_ID);
    let input_item_quality = get_value(INPUT_QUALITY_SELECT_ID);
    let input_distinct_item = new DistinctItem(input_item_key, input_item_quality);
    return input_distinct_item;
}

export function get_output_distinct_item() {
    let output_item_key = get_value(OUTPUT_ITEM_SELECT_ID);
    let output_item_quality = get_value(OUTPUT_QUALITY_SELECT_ID);
    let output_distinct_item = new DistinctItem(output_item_key, output_item_quality);
    return output_distinct_item;
}
