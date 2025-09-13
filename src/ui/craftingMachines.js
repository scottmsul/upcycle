import { CRAFTING_MACHINES_TABLE_DATA, parsed_data } from "../data.js";
import { DEFAULT_CRAFTING_MACHINE_COST, DEFAULT_CRAFTING_MACHINE_QUALITY, DEFAULT_INCLUDE_CRAFTING_MACHINE } from "../model/constants.js";
import { float_from_string, int_from_string } from "../util.js";
import { CRAFTING_MACHINES_TABLE_ID } from "./constants.js";
import { make_quality_select } from "./quality.js";
import { make_numeric_input } from "./util.js";

export function initialize_crafting_machines() {
    let crafting_machines_table = window.document.getElementById(CRAFTING_MACHINES_TABLE_ID);
    for(let crafting_machine of CRAFTING_MACHINES_TABLE_DATA) {
        let row_element = document.createElement('tr');
        row_element.setAttribute('id', crafting_machine.crafting_machine_key);

        let crafting_machine_checkbox = row_element.appendChild(document.createElement('td'))
            .appendChild(document.createElement('input'));
        crafting_machine_checkbox.setAttribute('type', 'checkbox');
        crafting_machine_checkbox.setAttribute('checked', true);

        row_element.appendChild(document.createElement('td'))
            .innerHTML = crafting_machine.localized_name;

        // this gets overridden during the display phase
        // might want to refactor/consolidate these two phases into one step
        row_element.appendChild(document.createElement('td'))
            .appendChild(make_quality_select(0));

        row_element.appendChild(document.createElement('td'))
            .appendChild(make_numeric_input(0));

        crafting_machines_table.appendChild(row_element);
    }
}

export function display_crafting_machine_data(data) {
    let crafting_machines_table = window.document.getElementById(CRAFTING_MACHINES_TABLE_ID);
    for(let row of Array.from(crafting_machines_table.children)) {
        let crafting_machine_key = row.id;
        let crafting_machine_data = data.get(crafting_machine_key);
        row.children[0].firstChild.checked = crafting_machine_data.include;
        row.children[2].firstChild.value = crafting_machine_data.quality;
        row.children[3].firstChild.value = crafting_machine_data.cost;
    }
}

export function get_crafting_machines_table_data() {
    let data = new Map();
    let table = window.document.getElementById(CRAFTING_MACHINES_TABLE_ID);
    for(let row of Array.from(table.children)) {
        let current_crafting_machine_key = row.id;

        let current_crafting_machine_data = {
            include: row.children[0].firstChild.checked,
            quality: parseInt(row.children[2].firstChild.value),
            cost: parseFloat(row.children[3].firstChild.value)
        };

        data.set(current_crafting_machine_key, current_crafting_machine_data);
    }
    return data;
}

export function crafting_machines_from_string(s) {
    // we need values for all crafting machine keys
    let input_obj = JSON.parse(s);
    if(!Array.isArray(input_obj)) return null;
    let input_map = new Map(input_obj);
    let output_map = new Map();
    for(let crafting_machine_key of parsed_data.crafting_machines.keys()) {
        var output_include = DEFAULT_INCLUDE_CRAFTING_MACHINE;
        var output_quality = DEFAULT_CRAFTING_MACHINE_QUALITY;
        var output_cost = DEFAULT_CRAFTING_MACHINE_COST;
        if(input_map.has(crafting_machine_key)) {
            let input_data = input_map.get(crafting_machine_key);

            if(input_data.hasOwnProperty('include') && (typeof input_data.include === 'boolean')) {
                output_include = input_data.include;
            }

            if(input_data.hasOwnProperty('quality')) {
                let input_quality = int_from_string(input_data.quality);
                if(!(isNaN(input_quality)) && (input_quality >= 0) && (input_quality <= 4)) {
                    output_quality = input_quality;
                }
            }

            if(input_data.hasOwnProperty('cost')) {
                let input_cost = float_from_string(input_data.cost);
                if(!(isNaN(input_cost)) && (input_cost >= 0)) {
                    output_cost = input_cost;
                }
            }
        }
        output_map.set(crafting_machine_key, {
            include: output_include,
            quality: output_quality,
            cost: output_cost
        });
    }
    return output_map;
}

