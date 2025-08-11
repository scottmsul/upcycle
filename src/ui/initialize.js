import { QUALITY_MODULE_TIER_SELECT_ID, QUALITY_MODULE_TIERS, PROD_MODULE_TIER_SELECT_ID, PROD_MODULE_TIERS, PROD_MODULE_QUALITY_SELECT_ID, QUALITY_MODULE_QUALITY_SELECT_ID, CRAFTING_MACHINE_QUALITY_SELECT_ID } from "./constants.js";
import { initialize_max_quality_unlocked_selector, initialize_quality_select_element } from "./quality.js";
import { initialize_productivity_research } from "./productivity_research.js";
import { add_input_item, add_output_item } from "./itemTables.js";
import { defaults } from "../data.js";

export function initialize_ui() {
    // run these each once to have some starting items
    initialize_max_quality_unlocked_selector();
    initialize_quality_selectors();
    initialize_module_tier_selectors();
    initialize_productivity_research();
    add_input_item();
    add_output_item();
}

function initialize_quality_selectors() {
    initialize_quality_select_element(window.document.getElementById(CRAFTING_MACHINE_QUALITY_SELECT_ID), defaults.CRAFTING_MACHINE_QUALITY);
    initialize_quality_select_element(window.document.getElementById(PROD_MODULE_QUALITY_SELECT_ID), defaults.PROD_MODULE_QUALITY_TYPE);
    initialize_quality_select_element(window.document.getElementById(QUALITY_MODULE_QUALITY_SELECT_ID), defaults.QUALITY_MODULE_QUALITY_TYPE);
}

function initialize_module_tier_selectors() {
    let quality_module_tier_select_element = window.document.getElementById(QUALITY_MODULE_TIER_SELECT_ID);
    for(let tier=0; tier < QUALITY_MODULE_TIERS.length; tier++) {
        let key = QUALITY_MODULE_TIERS[tier];
        let opt = document.createElement('option');
        opt.value = tier;
        opt.innerHTML = key;
        quality_module_tier_select_element.append(opt);
    }
    quality_module_tier_select_element.value = defaults.QUALITY_MODULE_TIER;

    let prod_module_tier_select_element = window.document.getElementById(PROD_MODULE_TIER_SELECT_ID);
    for(let tier=0; tier < PROD_MODULE_TIERS.length; tier++) {
        let key = PROD_MODULE_TIERS[tier];
        let opt = document.createElement('option');
        opt.value = tier;
        opt.innerHTML = key;
        prod_module_tier_select_element.append(opt);
    }
    prod_module_tier_select_element.value = defaults.PROD_MODULE_TIER;
}
