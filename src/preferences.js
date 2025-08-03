import { get_input_item_constraint_key, get_output_item_constraint_key } from "./ui.js";

export class Preferences {
    constructor() {
        // legendary
        this.max_quality_unlocked = 4;
        this.num_module_slots = 4;

        // legendary tier-3
        this.prod_bonus = 0.25;
        this.quality_probability = 0.062;

        this.recipe_cost = 0.0;

        // may want to generalize these somehow
        // like if we wanted byproduct costs or fixed inputs
        this.outputs = new Map();
        let output_amount = 1.0;
        let output_item_constraint_key = get_output_item_constraint_key();
        this.outputs.set(output_item_constraint_key, output_amount);

        this.inputs = new Map();
        let input_cost = 1.0;
        let input_item_constraint_key = get_input_item_constraint_key();
        this.inputs.set(input_item_constraint_key, input_cost);
    }
}
