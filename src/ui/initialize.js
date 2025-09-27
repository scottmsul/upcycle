import { PROD_MODULE_QUALITY_SELECT_ID, QUALITY_MODULE_QUALITY_SELECT_ID, BEACONED_SPEED_MODULE_QUALITY_SELECT_ID, BEACON_QUALITY_SELECT_ID, SPEED_MODULE_QUALITY_SELECT_ID } from "./constants.js";
import { initialize_max_quality_unlocked_selector, initialize_quality_selector } from "./quality.js";
import { initialize_productivity_research } from "./productivityResearch.js";
import { initialize_planets } from "./planets.js";
import { initialize_crafting_machines } from "./craftingMachines.js";

export function initialize_ui() {
    // run these each once to have some starting items
    initialize_max_quality_unlocked_selector();
    initialize_crafting_machines();
    initialize_quality_selectors();
    initialize_productivity_research();
    initialize_planets();
}

function initialize_quality_selectors() {
    initialize_quality_selector(window.document.getElementById(PROD_MODULE_QUALITY_SELECT_ID));
    initialize_quality_selector(window.document.getElementById(QUALITY_MODULE_QUALITY_SELECT_ID));
    initialize_quality_selector(window.document.getElementById(SPEED_MODULE_QUALITY_SELECT_ID));
    initialize_quality_selector(window.document.getElementById(BEACONED_SPEED_MODULE_QUALITY_SELECT_ID));
    initialize_quality_selector(window.document.getElementById(BEACON_QUALITY_SELECT_ID));
}
