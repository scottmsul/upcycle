import { defaults, ASTEROID_RESOURCE_TYPE, MINING_RESOURCE_TYPE, OFFSHORE_RESOURCE_TYPE, PLANT_RESOURCE_TYPE, PUMPJACK_RESOURCE_TYPE, RESOURCES } from "../data.js";
import { get_distinct_item_key } from "../distinctItem.js";
import { RESOURCES_TABLE_ID } from "./constants.js";

// probably should refactor the codebase into some kind of MVC-like pattern
// especially if we want selecting/de-selecting planets to hide/display rows in the resources table

export function initialize_resources() {
    let resources_table = window.document.getElementById(RESOURCES_TABLE_ID);

    let resource_type_default_costs = new Map([
        [MINING_RESOURCE_TYPE, defaults.MINING_RESOURCE_COST],
        [PUMPJACK_RESOURCE_TYPE, defaults.PUMPJACK_RESOURCE_COST],
        [OFFSHORE_RESOURCE_TYPE, defaults.OFFSHORE_RESOURCE_COST],
        [PLANT_RESOURCE_TYPE, defaults.PLANT_RESOURCE_COST],
        [ASTEROID_RESOURCE_TYPE, defaults.ASTEROID_RESOURCE_COST]
    ]);

    RESOURCES.forEach((resource_data, resource_key, map) => {
        // planet, resource type, resource, cost
        let row_element = document.createElement('tr');
        row_element.setAttribute('id', resource_key);

        let default_cost = resource_type_default_costs.get(resource_data.resource_type);

        row_element.appendChild(document.createElement('td'))
            .innerHTML = resource_data.planet;

        row_element.appendChild(document.createElement('td'))
            .innerHTML = resource_data.resource_type;

        row_element.appendChild(document.createElement('td'))
            .innerHTML = resource_data.item;

        let input_element = row_element
            .appendChild(document.createElement('td'))
            .appendChild(document.createElement('input'));
        input_element.setAttribute('type', 'number');
        input_element.setAttribute('value', default_cost);

        resources_table.appendChild(row_element);
    });
}

export function get_resources_table_data() {
    let data = new Map();
    let table = window.document.getElementById(RESOURCES_TABLE_ID);
    for(let row of Array.from(table.children)) {
        let resource_key = row.id;

        // planet, resource type, item, cost
        let cost = row.children[3].firstChild.value;

        data.set(resource_key, cost);
    }
    return data;
}
