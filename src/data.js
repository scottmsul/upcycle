import { raw_data as imported_raw_data } from './data/spaceAge2.0.11.js';
import { ParsedData } from './parsedData.js';

export const raw_data = imported_raw_data;
export const parsed_data = new ParsedData(imported_raw_data);

export const LOWEST_MAX_QUALITY_UNLOCKED = 2;
export const HIGHEST_MAX_QUALITY_UNLOCKED = 4;

export const QUALITY_MODULE_TIERS = ['quality-module-1', 'quality-module-2', 'quality-module-3'];
export const PROD_MODULE_TIERS = ['productivity-module-1', 'productivity-module-2', 'productivity-module-3'];
export const SPEED_MODULE_TIERS = ['speed-module-1', 'speed-module-2', 'speed-module-3'];

// the factorio json data has localized names for these planet keys
// define here to control order of appearance
// also include 'space-platform' as a 'planet' which while not semantically correct is a useful abstraction
export const PLANETS = ['nauvis', 'vulcanus', 'fulgora', 'gleba', 'aquilo', 'space-platform'];

// some hard-coded stuff involving item keys
export const PRODUCTIVITY_RESEARCH_ITEM_RECIPE_MAP = new Map([
    ['steel-plate', ['steel-plate', 'casting-steel']],
    ['low-density-structure', ['low-density-structure', 'casting-low-density-structure']],
    ['scrap', ['scrap-recycling']],
    ['processing-unit', ['processing-unit']],
    ['plastic-bar', ['plastic-bar']],
    ['rocket-fuel', ['rocket-fuel', 'rocket-fuel-from-jelly', 'ammonia-rocket-fuel']],
    ['asteroid', ['carbonic-asteroid-crushing', 'metallic-asteroid-crushing', 'oxide-asteroid-crushing',
        'advanced-carbonic-asteroid-crushing', 'advanced-metallic-asteroid-crushing', 'advanced-oxide-asteroid-crushing']]
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
export const MINING_RESOURCE_TYPE = 'mining';
export const PUMPJACK_RESOURCE_TYPE = 'pumpjack';
export const OFFSHORE_RESOURCE_TYPE = 'offshore';
export const PLANT_RESOURCE_TYPE = 'plant';
export const ASTEROID_RESOURCE_TYPE = 'asteroid';

export const SPACE_PLATFORM_RESOURCES = ['metallic-asteroid-chunk', 'carbonic-asteroid-chunk', 'oxide-asteroid-chunk', 'promethium-asteroid-chunk'];

function initialize_resources() {
    /** returns a map of {resource_name} -> {
     *      'planets': (array of planet names),
     *      'resource_type': (resource type),
     *      'item': (item name)
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
