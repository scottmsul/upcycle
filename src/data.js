//export * from './data/testData.js';
import { raw_data as imported_raw_data, defaults as version_defaults } from './data/spaceAge2.0.11.js';
import { defaults as shared_defaults } from './data/defaults.js';
import { ParsedData } from './parsedData.js';

export const raw_data = imported_raw_data;
export const defaults = {...version_defaults, ...shared_defaults};
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

// Useful ad-hoc abstraction of resources
export const MINING_RESOURCE_TYPE = 'mining';
export const PUMPJACK_RESOURCE_TYPE = 'pumpjack';
export const OFFSHORE_RESOURCE_TYPE = 'offshore';
export const PLANT_RESOURCE_TYPE = 'plant';
export const ASTEROID_RESOURCE_TYPE = 'asteroid';

export const SPACE_PLATFORM_RESOURCES = ['metallic-asteroid-chunk', 'carbonic-asteroid-chunk', 'oxide-asteroid-chunk', 'promethium-asteroid-chunk'];

function initialize_resources() {
    /** returns a map of {resource_name} -> {
     *      'planet': (planet name),
     *      'resource_type': (resource type),
     *      'item': (item name)
     * }
     * The resource name is often the same as the item name but not always.
     * We insert keys in the same order we want to display in the UI.
     */
    let resources = new Map();
    for(let planet of PLANETS) {
        let curr_resources = parsed_data.planet(planet).resources;

        // show mining before pumpjack
        let mining_resources = [];
        let pumpjack_resources = [];
        for(let resource_key of curr_resources.resource) {
            let raw_resource_data = parsed_data.resource(resource_key);
            let resource_type = (raw_resource_data.category == 'basic-fluid') ? PUMPJACK_RESOURCE_TYPE : MINING_RESOURCE_TYPE ;
            for(let result of raw_resource_data.results) {
                let resource_key = raw_resource_data.key;
                let resource_data = {
                    'planet': planet,
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
        mining_resources.forEach((resource) => resources.set(resource[0], resource[1]));
        pumpjack_resources.forEach((resource) => resources.set(resource[0], resource[1]));

        for(let item_key of curr_resources.offshore) {
            let resource_key = item_key;
            let resource_data = {
                'planet': planet,
                'resource_type': OFFSHORE_RESOURCE_TYPE,
                'item': item_key
            };
            resources.set(resource_key, resource_data);
        }

        for(let plant_key of curr_resources.plants) {
            let plant_data = parsed_data.plant(plant_key);
            for(let result of plant_data.results) {
                let resource_key = plant_key;
                let resource_data = {
                    'planet': planet,
                    'resource_type': PLANT_RESOURCE_TYPE,
                    'item': result.name
                };
                resources.set(resource_key, resource_data);
            }
        }

        if(planet == 'space-platform') {
            for(let item_key of SPACE_PLATFORM_RESOURCES) {
                let resource_key = item_key;
                let resource_data = {
                    'planet': planet,
                    'resource_type': ASTEROID_RESOURCE_TYPE,
                    'item': item_key
                };
                resources.set(resource_key, resource_data);
            }
        }
    }

    return resources;
}

export const RESOURCES = initialize_resources();
