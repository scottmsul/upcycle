import { INPUT_ITEMS_TABLE_ID, OUTPUT_ITEMS_TABLE_ID, PROD_MODULE_TIER_SELECT_ID, PROD_MODULE_QUALITY_SELECT_ID, QUALITY_MODULE_TIER_SELECT_ID, QUALITY_MODULE_QUALITY_SELECT_ID, QUALITY_MODULE_COST_INPUT_ID, PROD_MODULE_COST_INPUT_ID, CRAFTING_MACHINE_QUALITY_SELECT_ID, CRAFTING_MACHINE_COST_INPUT_ID, ALLOW_BYPRODUCTS_INPUT_ID } from "./ui/constants.js";
import { get_item_table_data } from "./ui/itemTables.js";
import { get_productivity_research_table_data } from "./ui/productivityResearch.js";
import { get_max_quality_unlocked } from "./ui/quality.js";
import { get_prod_module_bonus, get_prod_module_speed_penalty, get_quality_module_percent, MACHINE_QUALITY_SPEED_FACTORS, QUALITY_MODULE_SPEED_PENALTY } from "./util.js";

export class Preferences {
    constructor(parsed_data) {
        this.max_quality_unlocked = get_max_quality_unlocked();

        let crafting_machine_quality = parseInt(window.document.getElementById(CRAFTING_MACHINE_QUALITY_SELECT_ID).value);
        this.crafting_machine_quality_speed_factor = MACHINE_QUALITY_SPEED_FACTORS[crafting_machine_quality];
        this.crafting_machine_cost = parseFloat(window.document.getElementById(CRAFTING_MACHINE_COST_INPUT_ID).value);
        this.allow_byproducts = window.document.getElementById(ALLOW_BYPRODUCTS_INPUT_ID).checked;

        let quality_module_tier = parseInt(window.document.getElementById(QUALITY_MODULE_TIER_SELECT_ID).value);
        let quality_module_quality = parseInt(window.document.getElementById(QUALITY_MODULE_QUALITY_SELECT_ID).value);
        this.quality_probability = get_quality_module_percent(quality_module_tier, quality_module_quality);
        this.speed_penalty_per_quality_module = QUALITY_MODULE_SPEED_PENALTY;
        this.quality_module_cost = parseFloat(window.document.getElementById(QUALITY_MODULE_COST_INPUT_ID).value);

        let prod_module_tier = parseInt(window.document.getElementById(PROD_MODULE_TIER_SELECT_ID).value);
        let prod_module_quality = parseInt(window.document.getElementById(PROD_MODULE_QUALITY_SELECT_ID).value);
        this.prod_bonus = get_prod_module_bonus(prod_module_tier, prod_module_quality);
        this.speed_penalty_per_prod_module = get_prod_module_speed_penalty(prod_module_tier);
        this.prod_module_cost = parseFloat(window.document.getElementById(PROD_MODULE_COST_INPUT_ID).value);

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

        // may want to generalize these somehow
        // like if we wanted byproduct costs or fixed inputs
        this.inputs = get_item_table_data(INPUT_ITEMS_TABLE_ID);
        this.outputs = get_item_table_data(OUTPUT_ITEMS_TABLE_ID);
    }
}
