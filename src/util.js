export const MACHINE_QUALITY_SPEED_FACTORS = [1.0, 1.3, 1.6, 1.9, 2.5];

const MINIMUM_MODULE_SPEED_FACTOR = 0.2;
const JUMP_QUALITY_PROBABILITY = 0.1;
const QUALITY_MODULE_PERCENTS = [
    [.01, .013, .016, .019, .025],
    [.02, .026, .032, .038, .05],
    [.025, .032, .04, .047, .062]
];

export const QUALITY_MODULE_SPEED_PENALTY = .05;

const PROD_MODULE_BONUSES = [
    [.04, .05, .06, .07, 0.1],
    [.06, .07, .09, .11, .15],
    [.1, .13, .16, .19, .25]
]

export const PROD_MODULE_SPEED_PENALTIES = [0.05, 0.1, 0.15];

export const MAXIMUM_PROD_BONUS = 3.0;

export function get_quality_module_percent(module_tier, module_quality) {
    return QUALITY_MODULE_PERCENTS[module_tier][module_quality];
}

export function get_prod_module_bonus(module_tier, module_quality) {
    return PROD_MODULE_BONUSES[module_tier][module_quality];
}

export function get_prod_module_speed_penalty(module_tier) {
    return PROD_MODULE_SPEED_PENALTIES[module_tier];
}

export function calculate_module_speed_factor(distinct_recipe, preferences) {
    let module_speed_factor = 1.0
        - distinct_recipe.num_quality_modules * preferences.speed_penalty_per_quality_module
        - distinct_recipe.num_prod_modules * preferences.speed_penalty_per_prod_module;
    return Math.max(module_speed_factor, MINIMUM_MODULE_SPEED_FACTOR);
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
