import { PLANETS, PRODUCTIVITY_RESEARCH_ITEM_RECIPE_MAP, RESOURCES } from "../data.js";
import { DistinctItem, get_distinct_item_key } from "../distinctItem.js";

export class SolverInput {
    /**
     * Contains all necessary state for the solver input
     */
    constructor() {
        /**
         * Default values
         * Note quality=4 is legendary
         */

        // list of [distinct_item, cost] tuples
        // the UI doesn't enforce unique distinct items
        this.output_items = [];
        this.output_items.push([new DistinctItem('iron-plate', 4), 1.0]);

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

        // list of [distinct_item, cost] tuples
        // the UI doesn't enforce unique distinct items
        this.input_items = [];
    }
}

export function get_combined_inputs(solver_input) {
    /**
     * Combines the resources and input_items into a single input->cost Map
     */
    let inputs = new Map();
    solver_input.resources.forEach((cost, resource_key, map) => {
        let resource_data = RESOURCES.get(resource_key)
        let allowed_planets_with_resource = resource_data.planets.filter((planet) => solver_input.planets.get(planet));
        if(allowed_planets_with_resource.length > 0) {
            let distinct_item_key = get_distinct_item_key(resource_data.item, 0);
            inputs.set(distinct_item_key, cost);
        }
    })
    for(let [input_distinct_item, cost] of solver_input.input_items) {
        inputs.set(input_distinct_item.key, cost);
    }
    return inputs;
}
