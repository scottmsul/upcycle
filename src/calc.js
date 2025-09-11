import { PRODUCTIVITY_RESEARCH_RECIPE_ITEM_MAP } from "./data.js";

const MACHINE_QUALITY_SPEED_FACTORS = [1.0, 1.3, 1.6, 1.9, 2.5];
const BEACON_EFFICIENCIES = [1.5, 1.7, 1.9, 2.1, 2.5];
const MINIMUM_MODULE_SPEED_FACTOR = 0.2;
const MAXIMUM_PROD_BONUS = 3.0;
const JUMP_QUALITY_PROBABILITY = 0.1;

const QUALITY_MODULE_PERCENTS = [
    [.01, .013, .016, .019, .025],
    [.02, .026, .032, .038, .05],
    [.025, .032, .04, .047, .062]
];

const PROD_MODULE_BONUSES = [
    [.04, .05, .06, .07, 0.1],
    [.06, .07, .09, .11, .15],
    [.1, .13, .16, .19, .25]
];

const SPEED_BONUSES = [
    [0.2, 0.26, 0.32, 0.38, 0.5],
    [0.3, 0.39, 0.48, 0.57, 0.75],
    [0.5, 0.65, 0.8, 0.95, 1.25]
];

const QUALITY_MODULE_SPEED_PENALTY = .05;
const PROD_MODULE_SPEED_PENALTIES = [0.05, 0.1, 0.15];
const SPEED_MODULE_QUALITY_PENALTIES = [.01, .015, .025];

export function calculate_recipe_modifiers(distinct_recipe, parsed_data, solver_input) {
    let recipe_data = parsed_data.recipe(distinct_recipe.recipe_key);

    let crafting_machine_key = distinct_recipe.crafting_machine_key;
    let crafting_machine_data = parsed_data.crafting_machines.get(crafting_machine_key);
    let crafting_machine_base_speed = crafting_machine_data.crafting_speed;
    let crafting_machine_quality_speed_factor = MACHINE_QUALITY_SPEED_FACTORS[solver_input.crafting_machine_quality];
    let crafting_machine_speed = crafting_machine_base_speed * crafting_machine_quality_speed_factor;

    let beacon_efficiency = BEACON_EFFICIENCIES[solver_input.speed_beacon_quality];
    let num_effictive_speed_modules = calculate_num_effective_speed_modules(distinct_recipe.num_beaconed_speed_modules, beacon_efficiency);

    let speed_beacon_speed_factor_modifier = num_effictive_speed_modules * SPEED_BONUSES[solver_input.speed_module_tier][solver_input.speed_module_quality];
    let quality_module_speed_factor_modifier = (-1.0) * distinct_recipe.num_quality_modules * QUALITY_MODULE_SPEED_PENALTY;
    let prod_module_speed_factor_modifier = (-1.0) * distinct_recipe.num_prod_modules * PROD_MODULE_SPEED_PENALTIES[solver_input.prod_module_tier];
    let total_module_speed_factor_modifier = speed_beacon_speed_factor_modifier + quality_module_speed_factor_modifier + prod_module_speed_factor_modifier;
    let module_speed_factor = Math.max(1.0 + total_module_speed_factor_modifier, MINIMUM_MODULE_SPEED_FACTOR);

    let speed_factor = crafting_machine_speed * module_speed_factor;

    let quality_module_quality_percent = distinct_recipe.num_quality_modules * QUALITY_MODULE_PERCENTS[solver_input.quality_module_tier][solver_input.quality_module_quality];
    let speed_beacon_quality_percent_penalty = num_effictive_speed_modules * SPEED_MODULE_QUALITY_PENALTIES[solver_input.speed_module_tier];
    let quality_percent = Math.max(0.0, quality_module_quality_percent - speed_beacon_quality_percent_penalty);

    let crafting_machine_prod_bonus = crafting_machine_data.prod_bonus;
    let research_prod_bonus = PRODUCTIVITY_RESEARCH_RECIPE_ITEM_MAP.has(distinct_recipe.recipe_key) ?
        solver_input.productivity_research.get(PRODUCTIVITY_RESEARCH_RECIPE_ITEM_MAP.get(distinct_recipe.recipe_key))/100.0
        : 0.0;
    let module_prod_bonus = distinct_recipe.num_prod_modules * PROD_MODULE_BONUSES[solver_input.prod_module_tier][solver_input.prod_module_quality];
    let prod_bonus = Math.min(crafting_machine_prod_bonus + research_prod_bonus + module_prod_bonus, MAXIMUM_PROD_BONUS);

    return {
        'speed_factor': speed_factor,
        'quality_percent': quality_percent,
        'prod_bonus': prod_bonus
    };
}

function calculate_num_effective_speed_modules(num_beaconed_speed_modules, beacon_efficiency) {
    if(num_beaconed_speed_modules == 0) return 0;

    let num_beacons = Math.ceil(num_beaconed_speed_modules/2);
    let beacon_transmission_factor = beacon_efficiency * Math.pow(num_beacons, -0.5);
    let num_effictive_speed_modules = num_beaconed_speed_modules * beacon_transmission_factor;
    return num_effictive_speed_modules;
}

export function calculate_expected_result_amount(result_data, prod_bonus) {
    // see here: https://lua-api.factorio.com/latest/types/ItemProductPrototype.html
    let base_amount = result_data.amount || 0.5 * (result_data.amount_min + result_data.amount_max);
    let probabiity_factor = result_data.probability || 1.0;
    let ignored_by_productivity = result_data.ignored_by_productivity || 0.0;
    let extra_count_fraction = result_data.extra_count_fraction || 0.0;

    let base_amount_after_prod = ignored_by_productivity + (base_amount - ignored_by_productivity) * (1.0 + prod_bonus);
    let amount_after_probabilities = base_amount_after_prod * probabiity_factor * (1.0 + extra_count_fraction);
    return amount_after_probabilities;
}

export function calculate_quality_transition_probability(starting_quality, ending_quality, max_quality_unlocked, quality_percent) {
    if (starting_quality > max_quality_unlocked) {
        throw new Error('Starting quality cannot be above max quality unlocked');
    } else if(ending_quality > max_quality_unlocked) {
        throw new Error('Ending quality cannot be above max quality unlocked');
    } else if (ending_quality < starting_quality) {
        throw new Error('Ending quality cannot be below starting quality');
    }

    if ((ending_quality == starting_quality) && (starting_quality == max_quality_unlocked)) {
        // in this case there are no further qualities we can advance to, so quality remains the same with 100% probability.
        return 1.0;
    } else if (ending_quality == starting_quality) {
        // the probability that quality remains the same is (1 - probability-to-advance)
        return (1.0 - quality_percent);
    } else if ((ending_quality > starting_quality) && (ending_quality < max_quality_unlocked)) {
        // in this case we are producing a higher level quality with probability of quality_percent,
        // and jumped (ending_quality - starting_quality - 1) extra qualities with JUMP_QUALITY_PROBABILITY each time,
        // and the chance it doesn't advance further is 1-JUMP_QUALITY_PROBABILITY
        return quality_percent * (1.0-JUMP_QUALITY_PROBABILITY) * JUMP_QUALITY_PROBABILITY**(ending_quality - starting_quality - 1);
    } else if ((ending_quality > starting_quality) && (ending_quality == max_quality_unlocked)) {
        // this is the same case as above but without any probability of jumping further
        return quality_percent * JUMP_QUALITY_PROBABILITY**(ending_quality - starting_quality - 1);
    } else {
        throw new Error(`Reached impossible condition in calculate_quality_transition_probability. Starting_quality=${starting_quality}, ending_quality=${ending_quality}, max_quality_unlocked=${max_quality_unlocked}`);
    }
}

export function is_recipe_allowed(recipe_data, crafting_machine_data, parsed_data, solver_input) {
    // there are two ways in which a recipe might not be allowed
    // the first is by checking the surface_conditions of the recipe
    // the second is by checking the surface_conditions of the crafting machine
    // currently the code matches each recipe up to its preferred crafting machine first,
    // then checks whether this combination is allowed
    // theoretically this could cause issues if a recipe has multiple allowed crafting machines with different surface_properties,
    // though in practice I don't think anything in the game has this issue

    // probably more efficient ways to write this
    let recipe_surface_conditions = recipe_data.surface_conditions || [];
    let crafting_machine_surface_conditions = crafting_machine_data.surface_conditions || [];
    let all_surface_conditions = recipe_surface_conditions.concat(crafting_machine_surface_conditions);

    if(all_surface_conditions.length == 0) { return true; };

    // need one planet which satisfies all the conditions
    // note this is different than unioning all the planets properties
    for(let [planet_key, include_planet] of solver_input.planets.entries()) {
        if(include_planet) {
            let planet_data = parsed_data.planet(planet_key);
            var all_satisfied = true;
            for(let surface_condition of all_surface_conditions) {
                // some planets (ie nauvis) don't have certain surface properties and should default to not being valid
                if(!Object.hasOwn(planet_data.surface_properties, surface_condition.property)) {
                    all_satisfied = false;
                }

                if(Object.hasOwn(surface_condition, 'min')) {
                    if(surface_condition.min > planet_data.surface_properties[surface_condition.property]) {
                        all_satisfied = false;
                    }
                }
                if(Object.hasOwn(surface_condition, 'max')) {
                    if(surface_condition.max < planet_data.surface_properties[surface_condition.property]) {
                        all_satisfied = false;
                    }
                }
            }
            if(all_satisfied) { return true };
        }
    }

    return false;
}
