import { raw_data as imported_raw_data } from './data/spaceAge2.0.11.js';
import { ParsedData } from './parsedData.js';

export const raw_data = imported_raw_data;
export const parsed_data = new ParsedData(imported_raw_data);

export const LOWEST_MAX_QUALITY_UNLOCKED = 2;
export const HIGHEST_MAX_QUALITY_UNLOCKED = 4;

// the factorio json data has localized names for these planet keys
// define here to control order of appearance
// also include 'space-platform' as a 'planet' which while not semantically correct is a useful abstraction
export const PLANETS = ['nauvis', 'vulcanus', 'fulgora', 'gleba', 'aquilo', 'space-platform'];

// some hard-coded stuff involving item keys
export const PRODUCTIVITY_RESEARCH_ITEM_RECIPE_MAP = new Map([
    ['Asteroid', ['carbonic-asteroid-crushing', 'metallic-asteroid-crushing', 'oxide-asteroid-crushing',
        'advanced-carbonic-asteroid-crushing', 'advanced-metallic-asteroid-crushing', 'advanced-oxide-asteroid-crushing']],
    ['Low density structure', ['low-density-structure', 'casting-low-density-structure']],
    ['Plastic bar', ['plastic-bar']],
    ['Processing unit', ['processing-unit']],
    ['Rocket fuel', ['rocket-fuel', 'rocket-fuel-from-jelly', 'ammonia-rocket-fuel']],
    ['Scrap', ['scrap-recycling']],
    ['Steel plate', ['steel-plate', 'casting-steel']]
]);

// the inverted table is useful in certain cases
function initialize_productivity_research_recipe_item_map() {
    let data = new Map();
    PRODUCTIVITY_RESEARCH_ITEM_RECIPE_MAP.forEach((recipe_keys, item_key, map) => {
        for(let recipe_key of recipe_keys) {
            data.set(recipe_key, item_key);
        }
    });
    return data;
}
export const PRODUCTIVITY_RESEARCH_RECIPE_ITEM_MAP = initialize_productivity_research_recipe_item_map();

// Useful ad-hoc abstraction of resources
export const MINING_RESOURCE_TYPE = 'Mining';
export const PUMPJACK_RESOURCE_TYPE = 'Pumpjack';
export const OFFSHORE_RESOURCE_TYPE = 'Offshore';
export const PLANT_RESOURCE_TYPE = 'Plant';
export const ASTEROID_RESOURCE_TYPE = 'Asteroid';

export const SPACE_PLATFORM_RESOURCES = ['metallic-asteroid-chunk', 'carbonic-asteroid-chunk', 'oxide-asteroid-chunk', 'promethium-asteroid-chunk'];

function initialize_resources() {
    /** returns a map of {resource_name} -> {
     *      'planets': (array of planet keys),
     *      'resource_type': (resource type),
     *      'item': (item key)
     * }
     *
     * The resource name is often the same as the item name but not always.
     * We insert keys in the same ordering we want to display in the UI, which is:
     *      - 1. group by resource type in fixed order of [mining, pumpjack, offshore, plant, asteroid]
     *      - 2. sort by resource item name within each resource type group
     */
    let mining_resources = [];
    let pumpjack_resources = [];
    let offshore_resources = [];
    let plant_resources = [];
    let asteroid_resources = [];

    for(let planet of PLANETS) {
        let curr_resources = parsed_data.planet(planet).resources;

        for(let resource_key of curr_resources.resource) {
            let raw_resource_data = parsed_data.resource(resource_key);
            let resource_type = (raw_resource_data.category == 'basic-fluid') ? PUMPJACK_RESOURCE_TYPE : MINING_RESOURCE_TYPE ;
            for(let result of raw_resource_data.results) {
                let resource_key = raw_resource_data.key;
                let resource_data = {
                    'planets': [planet],
                    'resource_type': resource_type,
                    'item': result.name

                }
                if(resource_type == PUMPJACK_RESOURCE_TYPE) {
                    pumpjack_resources.push([resource_key, resource_data]);
                } else {
                    mining_resources.push([resource_key, resource_data]);
                }
            }
        }

        for(let item_key of curr_resources.offshore) {
            let resource_key = item_key;
            let resource_data = {
                'planets': [planet],
                'resource_type': OFFSHORE_RESOURCE_TYPE,
                'item': item_key
            };
            offshore_resources.push([resource_key, resource_data]);
        }

        for(let plant_key of curr_resources.plants) {
            let plant_data = parsed_data.plant(plant_key);
            for(let result of plant_data.results) {
                let resource_key = plant_key;
                let resource_data = {
                    'planets': [planet],
                    'resource_type': PLANT_RESOURCE_TYPE,
                    'item': result.name
                };
                plant_resources.push([resource_key, resource_data]);
            }
        }

        if(planet == 'space-platform') {
            for(let item_key of SPACE_PLATFORM_RESOURCES) {
                let resource_key = item_key;
                let resource_data = {
                    'planets': [planet],
                    'resource_type': ASTEROID_RESOURCE_TYPE,
                    'item': item_key
                };
                asteroid_resources.push([resource_key, resource_data]);
            }
        }
    }

    let resources = new Map();
    for(let curr_resource_list of [mining_resources, pumpjack_resources, offshore_resources, plant_resources, asteroid_resources]) {
        // display resources in alphabetical order within a resource type
        curr_resource_list.sort((a,b) => a[0].localeCompare(b[0]));

        for(let [resource_key, resource_data] of curr_resource_list) {
            if(!resources.has(resource_key)) {
                resources.set(resource_key, resource_data);
            } else {
                resources.get(resource_key).planets.push(resource_data.planets[0]);
            }
        }
    }

    return resources;
}

export const RESOURCES = initialize_resources();

// prepares a list of [{item_key: string, localized_name: string}] sorted by localized name for item table dropdowns
// only shows items that are used in recipes
function initialize_item_select_data() {
    let item_keys_in_recipes = new Map();
    parsed_data.recipes.forEach((recipe_data, recipe_key, map) => {
        for(let ingredient of recipe_data.ingredients) {
            if(!item_keys_in_recipes.has(ingredient.name)) {
                let ingredient_localized_name = parsed_data.item(ingredient.name).localized_name.en;
                item_keys_in_recipes.set(ingredient.name, ingredient_localized_name);
            }
        }
        for(let result of recipe_data.results) {
            if(!item_keys_in_recipes.has(result.name)) {
                let result_localized_name = parsed_data.item(result.name).localized_name.en;
                item_keys_in_recipes.set(result.name, result_localized_name);
            }
        }
    });
    let item_select_data = Array.from(item_keys_in_recipes.entries()).map(([item_key, localized_name]) => {
        return {
            'item_key': item_key,
            'localized_name': localized_name
        };
    });
    item_select_data.sort((a,b) => a.localized_name.localeCompare(b.localized_name));
    return item_select_data;
}

export const ITEM_SELECT_DATA = initialize_item_select_data();

// prepares a list of [{crafting_machine_key: string, localized_name: string}] sorted by localized name for crafting machines table
function initialize_crafting_machines_table_data() {
    let crafting_machines_table_data = [];
    parsed_data.crafting_machines.forEach((crafting_machine_data, crafting_machine_key, map) => {
        crafting_machines_table_data.push({
            crafting_machine_key: crafting_machine_key,
            localized_name: crafting_machine_data.localized_name.en
        });
    });
    crafting_machines_table_data.sort((a,b) => a.localized_name.localeCompare(b.localized_name));
    return crafting_machines_table_data;
}

export const CRAFTING_MACHINES_TABLE_DATA = initialize_crafting_machines_table_data();

// prepares a list of [{recipe_key: string, localized_name: string}] sorted by localized name for recipe select dropdowns
function initialize_recipe_select_data() {
    let recipe_select_data = [];
    parsed_data.recipes.forEach((recipe_data, recipe_key, map) => {
        recipe_select_data.push({
            recipe_key: recipe_key,
            localized_name: recipe_data.localized_name.en
        });
    });
    recipe_select_data.sort((a,b) => a.localized_name.localeCompare(b.localized_name));
    return recipe_select_data;
}

export const RECIPE_SELECT_DATA = initialize_recipe_select_data();
