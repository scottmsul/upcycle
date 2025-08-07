import { add_input_item, add_output_item } from "./itemTables.js";

export function initialize_ui() {
    // run these each once to have some starting items
    add_input_item();
    add_output_item();
}
