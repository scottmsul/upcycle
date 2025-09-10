import { MAX_QUALITY_UNLOCKED_SELECT_ID, QUALITY_FRIENDLY_NAMES } from "./constants.js";
import { HIGHEST_MAX_QUALITY_UNLOCKED, LOWEST_MAX_QUALITY_UNLOCKED } from "../data.js";

const QUALITY_SELECT_CLASS_NAME = 'quality-select';

export function initialize_max_quality_unlocked_selector() {
    // populates max quality selector from rare to legendary, does not set a value
    let select_element = window.document.getElementById(MAX_QUALITY_UNLOCKED_SELECT_ID);
    for(let quality = LOWEST_MAX_QUALITY_UNLOCKED; quality <= HIGHEST_MAX_QUALITY_UNLOCKED; quality++) {
        let option = document.createElement("option");
        option.value = quality;
        option.innerHTML = QUALITY_FRIENDLY_NAMES[quality];
        select_element.append(option);
    }
}

export function initialize_quality_selector(select_element) {
    select_element.classList.add(QUALITY_SELECT_CLASS_NAME);
    for(let quality=0; quality <= HIGHEST_MAX_QUALITY_UNLOCKED; quality++) {
        let option = document.createElement('option');
        option.value = quality;
        option.innerHTML = QUALITY_FRIENDLY_NAMES[quality];
        let class_name = quality_option_class_name(quality);
        option.classList.add(class_name);
        select_element.append(option);
    }
}

export function update_quality_selectors_to_max_quality(new_max_quality) {
    // update any dropdowns that are higher than new_max_quality to be equal to new_max_quality
    let select_elements = document.getElementsByClassName(QUALITY_SELECT_CLASS_NAME);
    for(let select_element of select_elements) {
        if(parseInt(select_element.value) > new_max_quality) {
            select_element.value = new_max_quality;
            select_element.dispatchEvent(new Event('change', {bubbles: true}));
        }
    }

    // display any qualities of lower or equal value
    for(let quality=LOWEST_MAX_QUALITY_UNLOCKED+1; quality<=new_max_quality; quality++) {
        let class_name = quality_option_class_name(quality);
        let option_elements = document.getElementsByClassName(class_name);
        for(let option_element of option_elements) {
            option_element.hidden = false;
        }
    }

    // hide any qualities of higher value
    for(let quality=new_max_quality+1; quality<=HIGHEST_MAX_QUALITY_UNLOCKED; quality++) {
        let class_name = quality_option_class_name(quality);
        let option_elements = document.getElementsByClassName(class_name);
        for(let option_element of option_elements) {
            option_element.hidden = true;
        }
    }
}

function quality_option_class_name(quality) {
    return `quality-option-${quality}`;
}
