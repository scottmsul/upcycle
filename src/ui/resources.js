import { RESOURCES } from "../data.js";
import { RESOURCES_TABLE_ID } from "./constants.js";

export function display_resources(resources, planets) {
    /**
     * resources represents current costs, and is a map from resource keys to costs
     * planets represents currently selected planets, and is a map from planet keys to booleans
     */
    let resources_table = window.document.getElementById(RESOURCES_TABLE_ID);
    resources_table.innerHTML = '';

    RESOURCES.forEach((resource_data, resource_key, map) => {
        let allowed_planets_with_resource = resource_data.planets.filter((planet) => planets.get(planet));

        let cost = resources.get(resource_key);

        // resource item, resource type, planets, cost
        let row_element = document.createElement('tr');
        row_element.setAttribute('id', resource_key);

        row_element.appendChild(document.createElement('td'))
            .innerHTML = resource_data.item;

        row_element.appendChild(document.createElement('td'))
            .innerHTML = resource_data.resource_type;

        row_element.appendChild(document.createElement('td'))
            .innerHTML = allowed_planets_with_resource.join(', ');

        let input_element = row_element
            .appendChild(document.createElement('td'))
            .appendChild(document.createElement('input'));
        input_element.setAttribute('type', 'number');
        input_element.setAttribute('value', cost);

        if(allowed_planets_with_resource.length > 0) {
            row_element.style.display = '';
        } else {
            row_element.style.display = 'none';
        }

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

export function set_resources_table_data(data) {
    let table = window.document.getElementById(RESOURCES_TABLE_ID);
    for(let row of Array.from(table.children)) {
        let resource_key = row.id;
        let new_cost = data.get(resource_key);

        // planet, resource type, item, cost
        row.children[3].firstChild.value = new_cost;
    }
}
