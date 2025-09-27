import { parsed_data, PLANETS, PRODUCTIVITY_RESEARCH_ITEM_RECIPE_MAP, RESOURCES } from "../data.js";
import { DistinctItem } from "../distinctItem.js";

export const DEFAULT_OUTPUT_ITEMS = [[new DistinctItem('iron-plate', 4), 1.0]];
export const DEFAULT_MAX_QUALITY_UNLOCKED = 4;

export const DEFAULT_INCLUDE_CRAFTING_MACHINE = true;
export const DEFAULT_CRAFTING_MACHINE_QUALITY = 4;
export const DEFAULT_CRAFTING_MACHINE_COST = 1.0;
export const DEFAULT_CRAFTING_MACHINES = new Map(
    Array.from(parsed_data.crafting_machines.keys()).map(crafting_machine_key => {
        return [crafting_machine_key, {
            include: DEFAULT_INCLUDE_CRAFTING_MACHINE,
            quality: DEFAULT_CRAFTING_MACHINE_QUALITY,
            cost: DEFAULT_CRAFTING_MACHINE_COST
        }];
    })
);

export const DEFAULT_ALLOW_BYPRODUCTS = true;
export const DEFAULT_QUALITY_MODULE_TIER = 2;
export const DEFAULT_QUALITY_MODULE_QUALITY = 4;
export const DEFAULT_QUALITY_MODULE_COST = 0.0;
export const DEFAULT_PROD_MODULE_TIER = 2;
export const DEFAULT_PROD_MODULE_QUALITY = 4;
export const DEFAULT_PROD_MODULE_COST = 0.0;
export const DEFAULT_SPEED_MODULE_TIER = 2;
export const DEFAULT_SPEED_MODULE_QUALITY = 4;
export const DEFAULT_SPEED_MODULE_COST = 0.0;
export const DEFAULT_CHECK_SPEED_BEACONS = true;
export const DEFAULT_BEACONED_SPEED_MODULE_TIER = 2;
export const DEFAULT_BEACONED_SPEED_MODULE_QUALITY = 4;
export const DEFAULT_BEACON_QUALITY = 4;
export const DEFAULT_MAX_BEACONED_SPEED_MODULES = 16;

// map from research productivity item names -> 0
export const DEFAULT_PRODUCTIVITY_RESEARCH_AMOUNT = 0;
export const DEFAULT_PRODUCTIVITY_RESEARCH = new Map(
    Array.from(PRODUCTIVITY_RESEARCH_ITEM_RECIPE_MAP.keys()).map(item_key => [item_key, DEFAULT_PRODUCTIVITY_RESEARCH_AMOUNT])
);

// map from planet names -> true
export const DEFAULT_INCLUDE_PLANET = true;
export const DEFAULT_PLANETS = new Map(
    PLANETS.map(planet => [planet, DEFAULT_INCLUDE_PLANET])
);

// map from resource names -> 0.0
export const DEFAULT_RESOURCE_COST = 0.0;
export const DEFAULT_RESOURCES = new Map(
    Array.from(RESOURCES.keys()).map(resource_key => [resource_key, DEFAULT_RESOURCE_COST])
);

export const DEFAULT_INPUT_ITEMS = [];

export const DEFAULT_WHITELIST_RECIPES = false;
export const DEFAULT_RECIPES = [];

// for clicking the 'add new (input/output) item' button
export const MIN_QUALITY_TYPE = 0;
export const MAX_QUALITY_TYPE = 1;
export const DEFAULT_INPUT_ITEM_ID = 'iron-plate';
export const DEFAULT_INPUT_ITEM_QUALITY_TYPE = MIN_QUALITY_TYPE;
export const DEFAULT_INPUT_ITEM_COST = 1.0;
export const DEFAULT_OUTPUT_ITEM_ID = 'iron-gear-wheel';
export const DEFAULT_OUTPUT_ITEM_QUALITY_TYPE = MAX_QUALITY_TYPE;
export const DEFAULT_OUTPUT_AMOUNT_PER_SECOND = 60.0;

// for clicking the 'add new recipe' button
export const DEFAULT_RECIPE_KEY = 'iron-gear-wheel';

// for local storage
export const OUTPUT_ITEMS_KEY = 'output_items';
export const CRAFTING_MACHINES_KEY = 'crafting_machines';
export const MAX_QUALITY_UNLOCKED_KEY = 'max_quality_unlocked';
export const ALLOW_BYPRODUCTS_KEY = 'allow_byproducts';
export const QUALITY_MODULE_TIER_KEY = 'quality_module_tier';
export const QUALITY_MODULE_QUALITY_KEY = 'quality_module_quality';
export const QUALITY_MODULE_COST_KEY = 'quality_module_cost';
export const PROD_MODULE_TIER_KEY = 'prod_module_tier';
export const PROD_MODULE_QUALITY_KEY = 'prod_module_quality';
export const PROD_MODULE_COST_KEY = 'prod_module_cost';
export const SPEED_MODULE_TIER_KEY = 'speed_module_tier';
export const SPEED_MODULE_QUALITY_KEY = 'speed_module_quality';
export const SPEED_MODULE_COST_KEY = 'speed_module_cost';
export const CHECK_SPEED_BEACONS_KEY = 'check_speed_beacons';
export const BEACONED_SPEED_MODULE_TIER_KEY = 'beaconed_speed_module_tier';
export const BEACONED_SPEED_MODULE_QUALITY_KEY = 'beaconed_speed_module_quality';
export const BEACON_QUALITY_KEY = 'beacon_quality';
export const MAX_BEACONED_SPEED_MODULES_KEY = 'max_beaconed_speed_modules';
export const PRODUCTIVITY_RESEARCH_KEY = 'productivity_research';
export const PLANETS_KEY = 'planets';
export const RESOURCES_KEY = 'resources';
export const INPUT_ITEMS_KEY = 'input_items';
export const WHITELIST_RECIPES_KEY = 'whitelist_recipes';
export const RECIPES_KEY = 'recipes';

export const ALL_SOLVER_INPUT_KEYS = [
    OUTPUT_ITEMS_KEY, MAX_QUALITY_UNLOCKED_KEY, ALLOW_BYPRODUCTS_KEY, CRAFTING_MACHINES_KEY,
    QUALITY_MODULE_TIER_KEY, QUALITY_MODULE_QUALITY_KEY, QUALITY_MODULE_COST_KEY,
    PROD_MODULE_TIER_KEY, PROD_MODULE_QUALITY_KEY, PROD_MODULE_COST_KEY,
    SPEED_MODULE_TIER_KEY, SPEED_MODULE_QUALITY_KEY, SPEED_MODULE_COST_KEY,
    CHECK_SPEED_BEACONS_KEY, BEACONED_SPEED_MODULE_TIER_KEY, BEACONED_SPEED_MODULE_QUALITY_KEY, BEACON_QUALITY_KEY, MAX_BEACONED_SPEED_MODULES_KEY,
    PRODUCTIVITY_RESEARCH_KEY, PLANETS_KEY, RESOURCES_KEY, INPUT_ITEMS_KEY,
    WHITELIST_RECIPES_KEY, RECIPES_KEY
];
