import { RESOURCES } from "../data.js";
import { get_distinct_item_key } from "../distinctItem.js";
import { getLocalStorageBoolean, getLocalStorageFloat, getLocalStorageInt, getLocalStorageObject } from "./localStorageUtil.js";
import { OUTPUT_ITEMS_KEY, MAX_QUALITY_UNLOCKED_KEY, ALLOW_BYPRODUCTS_KEY, QUALITY_MODULE_TIER_KEY, QUALITY_MODULE_QUALITY_KEY, QUALITY_MODULE_COST_KEY, PROD_MODULE_TIER_KEY, PROD_MODULE_QUALITY_KEY, PROD_MODULE_COST_KEY, CHECK_SPEED_BEACONS_KEY, SPEED_MODULE_TIER_KEY, SPEED_MODULE_QUALITY_KEY, SPEED_BEACON_QUALITY_KEY, MAX_BEACONED_SPEED_MODULES_KEY, PRODUCTIVITY_RESEARCH_KEY, PLANETS_KEY, RESOURCES_KEY, INPUT_ITEMS_KEY, DEFAULT_OUTPUT_ITEMS, DEFAULT_MAX_QUALITY_UNLOCKED, DEFAULT_CRAFTING_MACHINE_QUALITY, DEFAULT_CRAFTING_MACHINE_COST, DEFAULT_ALLOW_BYPRODUCTS, DEFAULT_QUALITY_MODULE_TIER, DEFAULT_QUALITY_MODULE_QUALITY, DEFAULT_QUALITY_MODULE_COST, DEFAULT_PROD_MODULE_TIER, DEFAULT_PROD_MODULE_QUALITY, DEFAULT_PROD_MODULE_COST, DEFAULT_CHECK_SPEED_BEACONS, DEFAULT_SPEED_MODULE_TIER, DEFAULT_SPEED_MODULE_QUALITY, DEFAULT_SPEED_BEACON_QUALITY, DEFAULT_MAX_BEACONED_SPEED_MODULES, DEFAULT_PRODUCTIVITY_RESEARCH, DEFAULT_PLANETS, DEFAULT_RESOURCES, WHITELIST_RECIPES_KEY, DEFAULT_WHITELIST_RECIPES, RECIPES_KEY, DEFAULT_RECIPES, CRAFTING_MACHINES_KEY, DEFAULT_CRAFTING_MACHINES, ALL_SOLVER_INPUT_KEYS } from './constants.js';
import { item_table_from_string } from "../ui/itemTables.js";
import { productivity_research_from_string } from "../ui/productivityResearch.js";
import { planets_from_string } from "../ui/planets.js";
import { resources_from_string } from "../ui/resources.js";
import { recipes_from_string } from "../ui/recipes.js";
import { crafting_machines_from_string } from "../ui/craftingMachines.js";

export class SolverInput {
    /**
     * Contains all necessary state for the solver input
     */
    constructor() {
        // list of [distinct_item, cost] tuples
        // the UI doesn't enforce unique distinct items
        this.output_items = getLocalStorageObject(OUTPUT_ITEMS_KEY, item_table_from_string, DEFAULT_OUTPUT_ITEMS);

        this.max_quality_unlocked = getLocalStorageInt(MAX_QUALITY_UNLOCKED_KEY, 0, 4, DEFAULT_MAX_QUALITY_UNLOCKED);
        this.allow_byproducts = getLocalStorageBoolean(ALLOW_BYPRODUCTS_KEY, DEFAULT_ALLOW_BYPRODUCTS);

        this.crafting_machines = getLocalStorageObject(CRAFTING_MACHINES_KEY, crafting_machines_from_string, DEFAULT_CRAFTING_MACHINES);

        this.quality_module_tier = getLocalStorageInt(QUALITY_MODULE_TIER_KEY, 0, 2, DEFAULT_QUALITY_MODULE_TIER);
        this.quality_module_quality = getLocalStorageInt(QUALITY_MODULE_QUALITY_KEY, 0, 4, DEFAULT_QUALITY_MODULE_QUALITY);
        this.quality_module_cost = getLocalStorageFloat(QUALITY_MODULE_COST_KEY, DEFAULT_QUALITY_MODULE_COST);

        this.prod_module_tier = getLocalStorageInt(PROD_MODULE_TIER_KEY, 0, 2, DEFAULT_PROD_MODULE_TIER);
        this.prod_module_quality = getLocalStorageInt(PROD_MODULE_QUALITY_KEY, 0, 4, DEFAULT_PROD_MODULE_QUALITY);
        this.prod_module_cost = getLocalStorageFloat(PROD_MODULE_COST_KEY, DEFAULT_PROD_MODULE_COST);

        this.check_speed_beacons = getLocalStorageBoolean(CHECK_SPEED_BEACONS_KEY, DEFAULT_CHECK_SPEED_BEACONS);
        this.speed_module_tier = getLocalStorageInt(SPEED_MODULE_TIER_KEY, 0, 2, DEFAULT_SPEED_MODULE_TIER);
        this.speed_module_quality = getLocalStorageInt(SPEED_MODULE_QUALITY_KEY, 0, 4, DEFAULT_SPEED_MODULE_QUALITY);
        this.speed_beacon_quality = getLocalStorageInt(SPEED_BEACON_QUALITY_KEY, 0, 4, DEFAULT_SPEED_BEACON_QUALITY);
        this.max_beaconed_speed_modules = getLocalStorageInt(MAX_BEACONED_SPEED_MODULES_KEY, 0, 16, DEFAULT_MAX_BEACONED_SPEED_MODULES);

        // map from prod research keys to percent bonuses
        this.productivity_research = getLocalStorageObject(PRODUCTIVITY_RESEARCH_KEY, productivity_research_from_string, DEFAULT_PRODUCTIVITY_RESEARCH);

        // map from planets to bools
        this.planets = getLocalStorageObject(PLANETS_KEY, planets_from_string, DEFAULT_PLANETS);

        // map from resource keys to costs
        this.resources = getLocalStorageObject(RESOURCES_KEY, resources_from_string, DEFAULT_RESOURCES);

        // list of [distinct_item, cost] tuples
        // the UI doesn't enforce unique distinct items
        this.input_items = getLocalStorageObject(INPUT_ITEMS_KEY, item_table_from_string, []);

        // internally we only track whether the recipes select type is a whitelist as a boolean
        this.whitelist_recipes = getLocalStorageBoolean(WHITELIST_RECIPES_KEY, DEFAULT_WHITELIST_RECIPES);

        this.recipes = getLocalStorageObject(RECIPES_KEY, recipes_from_string, DEFAULT_RECIPES);
    }

    set_value(key, value) {
        // replace all Maps with [(key,value)] arrays, their default serialization is just {}
        function replacer(key, value) {
            if(value instanceof Map) return Array.from(value.entries());
            else return value;
        }
        localStorage.setItem(key, JSON.stringify(value, replacer));
        this[key] = value;
    }

    copy() {
        let copy_obj = {};
        for(let solver_input_key of ALL_SOLVER_INPUT_KEYS) {
            copy_obj[solver_input_key] = this[solver_input_key];
        }
        return copy_obj;
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
