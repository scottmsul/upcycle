const JUMP_QUALITY_PROBABILITY = 0.1;

export function calculate_quality_probability_factor(starting_quality, ending_quality, max_quality_unlocked, quality_percent) {
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
        throw new Error(`Reached impossible condition in calculate_quality_probability_factor. Starting_quality=${starting_quality}, ending_quality=${ending_quality}, max_quality_unlocked=${max_quality_unlocked}`);
    }
}
