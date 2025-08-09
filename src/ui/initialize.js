import { add_input_item, add_output_item } from "./itemTables.js";
import { SOLVER_TAB_BUTTON_ID, SOLVER_TAB_ID, PREFERENCES_TAB_BUTTON_ID, PREFERENCES_TAB_ID, QUALITY_MODULE_TIER_SELECT_ID, QUALITY_MODULE_TIERS, PROD_MODULE_TIER_SELECT_ID, PROD_MODULE_TIERS, PROD_MODULE_QUALITY_SELECT_ID, QUALITY_MODULE_QUALITY_SELECT_ID } from "./constants.js";
import { initialize_max_quality_unlocked_selector, initialize_quality_select_element } from "./quality.js";
import { defaults } from "../data.js";

export function initialize_ui() {
    // run these each once to have some starting items
    initialize_max_quality_unlocked_selector();
    initialize_module_selectors();
    add_input_item();
    add_output_item();
    initialize_tabs();
}

function initialize_tabs() {
    let solver_tab = document.getElementById(SOLVER_TAB_ID);
    let preferences_tab = document.getElementById(PREFERENCES_TAB_ID);
    let tabs = [solver_tab, preferences_tab];

    let set_tab = (selected_tab_id) => {
        for(let tab of tabs) {
            if(tab.id == selected_tab_id) {
                tab.style.setProperty('display', 'block');
            } else {
                tab.style.setProperty('display', 'none');
            }
        }
    };

    document.getElementById(SOLVER_TAB_BUTTON_ID).onclick = () => set_tab(SOLVER_TAB_ID);
    document.getElementById(PREFERENCES_TAB_BUTTON_ID).onclick = () => set_tab(PREFERENCES_TAB_ID);
}

function initialize_module_selectors() {
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

    initialize_quality_select_element(window.document.getElementById(PROD_MODULE_QUALITY_SELECT_ID), defaults.PROD_MODULE_QUALITY_TYPE);
    initialize_quality_select_element(window.document.getElementById(QUALITY_MODULE_QUALITY_SELECT_ID), defaults.QUALITY_MODULE_QUALITY_TYPE);
}
