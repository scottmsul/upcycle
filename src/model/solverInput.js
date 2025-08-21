import { PLANETS, PRODUCTIVITY_RESEARCH_ITEM_RECIPE_MAP, RESOURCES } from "../data.js";
import { get_distinct_item_key } from "../distinctItem.js";
import { INPUT_ITEMS_TABLE_ID, OUTPUT_ITEMS_TABLE_ID, PROD_MODULE_TIER_SELECT_ID, PROD_MODULE_QUALITY_SELECT_ID, QUALITY_MODULE_TIER_SELECT_ID, QUALITY_MODULE_QUALITY_SELECT_ID, QUALITY_MODULE_COST_INPUT_ID, PROD_MODULE_COST_INPUT_ID, CRAFTING_MACHINE_QUALITY_SELECT_ID, CRAFTING_MACHINE_COST_INPUT_ID, ALLOW_BYPRODUCTS_INPUT_ID, CHECK_SPEED_BEACONS_INPUT_ID, SPEED_MODULE_TIER_SELECT_ID, SPEED_MODULE_QUALITY_SELECT_ID, BEACON_QUALITY_SELECT_ID, MAX_BEACONED_SPEED_MODULES_INPUT_ID } from "../ui/constants.js";
import { get_item_table_data } from "../ui/itemTables.js";
import { get_planets_table_data } from "../ui/planets.js";
import { get_productivity_research_table_data } from "../ui/productivityResearch.js";
import { get_max_quality_unlocked } from "../ui/quality.js";
import { get_resources_table_data } from "../ui/resources.js";
import { get_checkbox_value, get_float_value, get_int_value } from "../ui/util.js";

export class SolverInput {
    /**
     * Contains all necessary state for the solver input
     */
    constructor() {
        /**
         * Default values
         * Note quality=4 is legendary
         */
        this.output_items = new Map();
        this.output_items.set(get_distinct_item_key('iron-plate', 4), 1.0);

        this.max_quality_unlocked = 4;
        this.crafting_machine_quality = 4;
        this.crafting_machine_cost = 1.0
        this.allow_byproducts = true;

        this.quality_module_tier = 2;
        this.quality_module_quality = 4;
        this.quality_module_cost = 0.0;

        this.prod_module_tier = 2;
        this.prod_module_quality = 4;
        this.prod_module_cost = 0.0;

        this.check_speed_beacons = true;
        this.speed_module_tier = 2;
        this.speed_module_quality = 4;
        this.speed_beacon_quality = 4;
        this.max_beaconed_speed_modules = 16;

        // map from prod research keys to percent bonuses
        this.productivity_research = new Map();
        for(let item_key of PRODUCTIVITY_RESEARCH_ITEM_RECIPE_MAP.keys()) {
            this.productivity_research.set(item_key, 0.0);
        }

        // map from planets to bools
        this.planets = new Map();
        for(let planet of PLANETS) {
            this.planets.set(planet, true);
        }

        // map from resource keys to costs
        this.resources = new Map();
        for(let resource_key of RESOURCES.keys()) {
            this.resources.set(resource_key, 0.0);
        }

        // map from distinct item keys to costs
        this.input_items = new Map();
    }

    set_to_ui() {
        // in a true MVC the model doesn't update itself from the UI
        // this function only exists as an intermediate refactoring step
        this.output_items = get_item_table_data(OUTPUT_ITEMS_TABLE_ID);

        this.max_quality_unlocked = get_max_quality_unlocked();
        this.crafting_machine_quality = get_int_value(CRAFTING_MACHINE_QUALITY_SELECT_ID);
        this.crafting_machine_cost = get_float_value(CRAFTING_MACHINE_COST_INPUT_ID);
        this.allow_byproducts = get_checkbox_value(ALLOW_BYPRODUCTS_INPUT_ID);

        this.quality_module_tier = get_int_value(QUALITY_MODULE_TIER_SELECT_ID);
        this.quality_module_quality = get_int_value(QUALITY_MODULE_QUALITY_SELECT_ID);
        this.quality_module_cost = get_float_value(QUALITY_MODULE_COST_INPUT_ID);

        this.prod_module_tier = get_int_value(PROD_MODULE_TIER_SELECT_ID);
        this.prod_module_quality = get_int_value(PROD_MODULE_QUALITY_SELECT_ID);
        this.prod_module_cost = get_float_value(PROD_MODULE_COST_INPUT_ID);

        this.check_speed_beacons = get_checkbox_value(CHECK_SPEED_BEACONS_INPUT_ID);
        this.speed_module_tier = get_int_value(SPEED_MODULE_TIER_SELECT_ID);
        this.speed_module_quality = get_int_value(SPEED_MODULE_QUALITY_SELECT_ID);
        this.speed_beacon_quality = get_int_value(BEACON_QUALITY_SELECT_ID);
        this.max_beaconed_speed_modules = this.check_speed_beacons ? get_int_value(MAX_BEACONED_SPEED_MODULES_INPUT_ID) : 0;

        // map from prod research keys to percent bonuses
        this.productivity_research = get_productivity_research_table_data();

        // map from planets to bools
        this.planets = get_planets_table_data();

        // map from resource keys to costs
        this.resources = get_resources_table_data();

        // map from distinct item keys to costs
        this.input_items = get_item_table_data(INPUT_ITEMS_TABLE_ID);
    }
}

export function get_combined_inputs(solver_input) {
    /**
     * Combines the resources and input_items into a single input->cost Map
     */
    let inputs = new Map();
    solver_input.resources.forEach((cost, resource_key, map) => {
        let resource_data = RESOURCES.get(resource_key)
        if(solver_input.planets.get(resource_data.planet)) {
            let distinct_item_key = get_distinct_item_key(resource_data.item, 0);
            inputs.set(distinct_item_key, cost);
        }
    })
    solver_input.input_items.forEach((cost, distinct_item_key, map) => {
        inputs.set(distinct_item_key, cost);
    })
    return inputs;
}
