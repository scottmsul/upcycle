import { parsed_data, PLANETS } from "../data.js";
import { DEFAULT_INCLUDE_PLANET } from "../model/constants.js";
import { PLANETS_TABLE_ID } from "./constants.js";

export function initialize_planets() {
    let planets_table = window.document.getElementById(PLANETS_TABLE_ID);
    for(let planet_key of PLANETS) {
        let row_element = document.createElement('tr');

        let planet_checkbox = row_element.appendChild(document.createElement('td'))
            .appendChild(document.createElement('input'));
        planet_checkbox.setAttribute('type', 'checkbox');
        planet_checkbox.setAttribute('checked', true);

        let planet_element = row_element.appendChild(document.createElement('td'));
        planet_element.id = planet_key;
        planet_element.innerHTML = parsed_data.planets.get(planet_key).localized_name.en;

        planets_table.appendChild(row_element);
    }
}

export function get_planets_table_data() {
    let data = new Map();
    let table = window.document.getElementById(PLANETS_TABLE_ID);
    for(let row of Array.from(table.children)) {
        //planet - <tr><td>.innerHTML
        let planet = row.children[1].id;
        //checkbox - <tr><td><input>.checked
        let include_planet = row.children[0].firstChild.checked;

        data.set(planet, include_planet);
    }
    return data;
}

export function set_planets_table_data(data) {
    let table = window.document.getElementById(PLANETS_TABLE_ID);
    for(let row of Array.from(table.children)) {
        //planet - <tr><td>.id
        let planet = row.children[1].id;

        let include_planet = data.get(planet);
        //checkbox - <tr><td><input>.checked
        row.children[0].firstChild.checked = include_planet;
    }
}

// returns null if not valid
// sets bad values to true
export function planets_from_string(s) {
    let input_obj = JSON.parse(s);
    if(!Array.isArray(input_obj)) return null;
    let input_map = new Map(input_obj);
    let output_map = new Map();
    for(let planet of PLANETS) {
        output_map.set(planet, DEFAULT_INCLUDE_PLANET);
        if(!input_map.has(planet)) continue;
        let input_value = input_map.get(planet);
        if(!(typeof input_value === 'boolean')) continue;
        output_map.set(planet, input_value);
    }
    return output_map;
}
