import { PLANETS } from "../data.js";
import { PLANETS_TABLE_ID } from "./constants.js";

export function initialize_planets() {
    let planets_table = window.document.getElementById(PLANETS_TABLE_ID);
    for(let planet_key of PLANETS) {
        let row_element = document.createElement('tr');

        let planet_checkbox = row_element.appendChild(document.createElement('td'))
            .appendChild(document.createElement('input'));
        planet_checkbox.setAttribute('type', 'checkbox');
        planet_checkbox.setAttribute('checked', true);

        row_element.appendChild(document.createElement('td'))
            .innerHTML = planet_key;

        planets_table.appendChild(row_element);
    }
}

export function get_planets_table_data() {
    let data = [];
    let table = window.document.getElementById(PLANETS_TABLE_ID);
    for(let row of Array.from(table.children)) {
        //checkbox - <tr><td><input>.checked
        if(row.children[0].firstChild.checked) {
            //planet_key - <tr><td>.innerHTML
            data.push(row.children[1].innerHTML);
        }
    }
    return data;
}
