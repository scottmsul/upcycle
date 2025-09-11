import { parsed_data } from "../data.js";
import { ALLOW_BYPRODUCTS_INPUT_ID, BEACON_QUALITY_SELECT_ID, BLACKLIST_RECIPES_INPUT_ID, CHECK_SPEED_BEACONS_INPUT_ID, CRAFTING_MACHINE_COST_INPUT_ID, CRAFTING_MACHINE_QUALITY_SELECT_ID, INPUT_ITEMS_TABLE_ID, MAX_BEACONED_SPEED_MODULES_INPUT_ID, MAX_QUALITY_UNLOCKED_SELECT_ID, OUTPUT_ITEMS_TABLE_ID, PROD_MODULE_COST_INPUT_ID, PROD_MODULE_QUALITY_SELECT_ID, PROD_MODULE_TIER_SELECT_ID, QUALITY_MODULE_COST_INPUT_ID, QUALITY_MODULE_QUALITY_SELECT_ID, QUALITY_MODULE_TIER_SELECT_ID, SPEED_MODULE_QUALITY_SELECT_ID, SPEED_MODULE_TIER_SELECT_ID, WHITELIST_RECIPES_INPUT_ID } from "./constants.js";
import { display_item_table } from "./itemTables.js";
import { set_planets_table_data } from "./planets.js";
import { set_productivity_research_table_data } from "./productivityResearch.js";
import { display_recipe_table } from "./recipes.js";
import { display_resources } from "./resources.js";

export function display_solver_input(solver_input) {
    display_item_table(OUTPUT_ITEMS_TABLE_ID, solver_input.output_items);

    window.document.getElementById(MAX_QUALITY_UNLOCKED_SELECT_ID).value = solver_input.max_quality_unlocked;
    window.document.getElementById(CRAFTING_MACHINE_QUALITY_SELECT_ID).value = solver_input.crafting_machine_quality;
    window.document.getElementById(CRAFTING_MACHINE_COST_INPUT_ID).value = solver_input.crafting_machine_cost;
    window.document.getElementById(ALLOW_BYPRODUCTS_INPUT_ID).checked = solver_input.allow_byproducts;

    window.document.getElementById(QUALITY_MODULE_TIER_SELECT_ID).value = solver_input.quality_module_tier;
    window.document.getElementById(QUALITY_MODULE_QUALITY_SELECT_ID).value = solver_input.quality_module_quality;
    window.document.getElementById(QUALITY_MODULE_COST_INPUT_ID).value = solver_input.quality_module_cost;

    window.document.getElementById(PROD_MODULE_TIER_SELECT_ID).value = solver_input.prod_module_tier;
    window.document.getElementById(PROD_MODULE_QUALITY_SELECT_ID).value = solver_input.prod_module_quality;
    window.document.getElementById(PROD_MODULE_COST_INPUT_ID).value = solver_input.prod_module_cost;

    window.document.getElementById(CHECK_SPEED_BEACONS_INPUT_ID).checked = solver_input.check_speed_beacons;
    window.document.getElementById(SPEED_MODULE_TIER_SELECT_ID).value = solver_input.speed_module_tier;
    window.document.getElementById(SPEED_MODULE_QUALITY_SELECT_ID).value = solver_input.speed_module_quality;
    window.document.getElementById(BEACON_QUALITY_SELECT_ID).value = solver_input.speed_beacon_quality;
    window.document.getElementById(MAX_BEACONED_SPEED_MODULES_INPUT_ID).value = solver_input.max_beaconed_speed_modules;

    // map from prod research keys to percent bonuses
    set_productivity_research_table_data(solver_input.productivity_research);

    // map from planets to bools
    set_planets_table_data(solver_input.planets);

    // map from resource keys to costs
    display_resources(solver_input.resources, solver_input.planets);

    // map from distinct item keys to costs
    display_item_table(INPUT_ITEMS_TABLE_ID, solver_input.input_items);

    window.document.getElementById(BLACKLIST_RECIPES_INPUT_ID).checked = !(solver_input.whitelist_recipes);
    window.document.getElementById(WHITELIST_RECIPES_INPUT_ID).checked = solver_input.whitelist_recipes;
    display_recipe_table(solver_input.recipes);
}
