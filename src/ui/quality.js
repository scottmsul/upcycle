import { MAX_QUALITY_UNLOCKED_SELECT_ID, QUALITY_FRIENDLY_NAMES } from "./constants.js";
import { defaults, HIGHEST_MAX_QUALITY_UNLOCKED, LOWEST_MAX_QUALITY_UNLOCKED } from "../data.js";

export function initialize_max_quality_unlocked_selector() {
    let select_element = window.document.getElementById(MAX_QUALITY_UNLOCKED_SELECT_ID);
    for(let quality = LOWEST_MAX_QUALITY_UNLOCKED; quality <= HIGHEST_MAX_QUALITY_UNLOCKED; quality++) {
        let opt = document.createElement("option");
        opt.value = quality;
        opt.innerHTML = QUALITY_FRIENDLY_NAMES[quality];
        select_element.append(opt);
    }
    select_element.value = defaults.MAX_QUALITY_UNLOCKED;
}

export function set_max_quality_unlocked(quality) {
    window.document.getElementById(MAX_QUALITY_UNLOCKED_SELECT_ID).value = quality;
}

export function get_max_quality_unlocked() {
    return parseInt(window.document.getElementById(MAX_QUALITY_UNLOCKED_SELECT_ID).value);
}

export function new_quality_select_element(initial_quality) {
    let quality_select_element = document.createElement('select');
    initialize_quality_select_element(quality_select_element, initial_quality);
    return quality_select_element;
}

export function initialize_quality_select_element(quality_select_element, initial_quality) {
    let initial_max_quality_unlocked = get_max_quality_unlocked();

    set_quality_select_state(quality_select_element, initial_quality, initial_max_quality_unlocked)

    // makes sure quality selectors can only select up to max_quality_unlocked
    // uses a closure on quality_select_element
    let max_quality_select_element = window.document.getElementById(MAX_QUALITY_UNLOCKED_SELECT_ID);
    max_quality_select_element.addEventListener('change', (event) => {
        let prev_quality_value = parseInt(quality_select_element.value);
        let new_max_quality_unlocked = parseInt(event.target.value);
        let new_quality_value = Math.min(prev_quality_value, new_max_quality_unlocked);
        set_quality_select_state(quality_select_element, new_quality_value, new_max_quality_unlocked);
    });
}

function set_quality_select_state(quality_select_element, quality_value, max_quality_unlocked) {
    quality_select_element.innerHTML = '';
    for(let quality = 0; quality <= max_quality_unlocked; quality++) {
        let opt = document.createElement('option');
        opt.value = quality;
        opt.innerHTML = QUALITY_FRIENDLY_NAMES[quality];
        quality_select_element.append(opt);
    }
    quality_select_element.value = quality_value;
}
