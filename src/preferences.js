import { INPUT_ITEMS_TABLE_ID, OUTPUT_ITEMS_TABLE_ID } from "./ui/constants.js";
import { get_item_table_data } from "./ui/itemTables.js";

export class Preferences {
    constructor(parsed_data) {
        // legendary
        this.max_quality_unlocked = 4;

        // legendary tier-3
        this.prod_bonus = 0.25;
        this.quality_probability = 0.062;

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

        this.recipe_cost = 0.0;

        // may want to generalize these somehow
        // like if we wanted byproduct costs or fixed inputs
        this.inputs = get_item_table_data(INPUT_ITEMS_TABLE_ID);
        this.outputs = get_item_table_data(OUTPUT_ITEMS_TABLE_ID);
    }
}
