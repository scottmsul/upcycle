import { INPUT_ITEMS_TABLE_ID, OUTPUT_ITEMS_TABLE_ID, PROD_MODULE_TIER_SELECT_ID, PROD_MODULE_QUALITY_SELECT_ID, QUALITY_MODULE_TIER_SELECT_ID, QUALITY_MODULE_QUALITY_SELECT_ID, QUALITY_MODULE_COST_INPUT_ID, PROD_MODULE_COST_INPUT_ID, CRAFTING_MACHINE_QUALITY_SELECT_ID, CRAFTING_MACHINE_COST_INPUT_ID, ALLOW_BYPRODUCTS_INPUT_ID, CHECK_SPEED_BEACONS_INPUT_ID, SPEED_MODULE_TIER_SELECT_ID, SPEED_MODULE_QUALITY_SELECT_ID, BEACON_QUALITY_SELECT_ID, MAX_BEACONED_SPEED_MODULES_INPUT_ID } from "./ui/constants.js";
import { get_item_table_data } from "./ui/itemTables.js";
import { get_planets_table_data } from "./ui/planets.js";
import { get_productivity_research_table_data } from "./ui/productivityResearch.js";
import { get_max_quality_unlocked } from "./ui/quality.js";
import { get_checkbox_value, get_float_value, get_int_value } from "./ui/util.js";

export class Preferences {
    constructor(parsed_data) {
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

        // for now just get the best building for each category
        this.preferred_crafting_machine_by_category = new Map();
        parsed_data.crafting_categories_to_crafting_machines.forEach((crafting_machine_keys, crafting_category, map) => {
            let best_crafting_machine_so_far = parsed_data.crafting_machines.get(crafting_machine_keys[0]);
            for(let i=1; i<crafting_machine_keys.length; i++) {
                let curr_crafting_machine = parsed_data.crafting_machines.get(crafting_machine_keys[i]);
                if(curr_crafting_machine.crafting_speed > best_crafting_machine_so_far.crafting_speed) {
                    best_crafting_machine_so_far = curr_crafting_machine;
                }
            }
            this.preferred_crafting_machine_by_category.set(crafting_category, best_crafting_machine_so_far.key);
        });

        this.productivity_research = get_productivity_research_table_data();

        // data structure is an array of planet keys
        this.planets = get_planets_table_data();

        // may want to generalize these somehow
        // like if we wanted byproduct costs or fixed inputs
        this.inputs = get_item_table_data(INPUT_ITEMS_TABLE_ID);
        this.outputs = get_item_table_data(OUTPUT_ITEMS_TABLE_ID);
    }
}
