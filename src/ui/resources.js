import { defaults, parsed_data } from "../data.js";
import { get_distinct_item_key } from "../distinctItem.js";
import { get_all_resources } from "../util.js";
import { ASTEROID_RESOURCE_TYPE, MINING_RESOURCE_TYPE, OFFSHORE_RESOURCE_TYPE, PLANETS, PLANT_RESOURCE_TYPE, PUMPJACK_RESOURCE_TYPE, RESOURCES_TABLE_ID } from "./constants.js";

// probably should refactor the codebase into some kind of MVC-like pattern
// especially if we want selecting/de-selecting planets to hide/display rows in the resources table

export function initialize_resources() {
    let resources_table = window.document.getElementById(RESOURCES_TABLE_ID);
    let resources = get_all_resources(parsed_data, PLANETS);

    let resource_type_default_costs = new Map([
        [MINING_RESOURCE_TYPE, defaults.MINING_RESOURCE_COST],
        [PUMPJACK_RESOURCE_TYPE, defaults.PUMPJACK_RESOURCE_COST],
        [OFFSHORE_RESOURCE_TYPE, defaults.OFFSHORE_RESOURCE_COST],
        [PLANT_RESOURCE_TYPE, defaults.PLANT_RESOURCE_COST],
        [ASTEROID_RESOURCE_TYPE, defaults.ASTEROID_RESOURCE_COST]
    ]);

    for(let resource of resources) {
        // planet, resource type, resource, cost
        let row_element = document.createElement('tr');
        let default_cost = resource_type_default_costs.get(resource.resource_type);

        row_element.appendChild(document.createElement('td'))
            .innerHTML = resource.planet;

        row_element.appendChild(document.createElement('td'))
            .innerHTML = resource.resource_type;

        row_element.appendChild(document.createElement('td'))
            .innerHTML = resource.item;

        let input_element = row_element
            .appendChild(document.createElement('td'))
            .appendChild(document.createElement('input'));
        input_element.setAttribute('type', 'number');
        input_element.setAttribute('value', default_cost);

        resources_table.appendChild(row_element);
    }
}

export function get_resources_table_data(planets) {
    let data = new Map();
    let table = window.document.getElementById(RESOURCES_TABLE_ID);
    for(let row of Array.from(table.children)) {
        // planet, resource type, resource, cost
        let planet = row.children[0].innerHTML;
        let item = row.children[2].innerHTML;
        let cost = row.children[3].firstChild.value;
        if(planets.includes(planet)) {
            // the quality is needed throughout the solver, and resources only produce common items (at least for now - miners can have quality modules)
            let distinct_item_key = get_distinct_item_key(item, 0);
            data.set(distinct_item_key, cost);
        }
    }
    return data;
}
