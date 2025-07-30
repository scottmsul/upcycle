import GLPK from '../node_modules/glpk.js/dist/index.js';
import data from './data/testData.js';

const MAX_QUALITY_UNLOCKED = 4;
const JUMP_QUALITY_PROBABILITY = 0.1;
const NUM_MODULE_SLOTS = 4;
const QUALITY_PROBABILITY = 0.062; // legendary tier-3
const PROD_BONUS = 0.25; // legendary tier-3
const INPUT_COST = 1.0;
const RECIPE_COST = 0.0;
const OUTPUT_AMOUNT = 1.0;
const INPUT_ITEM_NAME = 'item-1';
const OUTPUT_ITEM_NAME = 'item-2';

function print(res) {
    const el = window.document.getElementById('out');
    el.innerHTML = `Solution: LP \n\n ${JSON.stringify(res, null, 2)}`;
};

function calculate_quality_probability_factor(starting_quality, ending_quality, max_quality_unlocked, quality_percent) {
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

function get_solver_variable(recipe_name, starting_quality, num_prod_modules, num_quality_modules) {
    return `recipe=${recipe_name}__starting_quality=${starting_quality}__num_prod_modules=${num_prod_modules}__num_quality_modules=${num_quality_modules}`;
}

function get_item_variable(item_name, item_quality) {
    return `item=${item_name}__quality=${item_quality}`;
}

async function solve_simple_factorio() {
    // start with simple ad-hoc example, abstract stuff later
    // one crafting recipe with one ingredient -> one product
    const glpk = await GLPK();

    // initialize costs
    let variable_costs = new Map();


    // initialize item-variable connections
    let item_variables = new Map();
    for(let item of data.items) {
        for(let quality = 0; quality <= MAX_QUALITY_UNLOCKED; quality++) {
            let item_name = item.key;
            let item_variable = get_item_variable(item_name, quality);
            item_variables.set(item_variable, []);
        }
    }

    // initialize item constraints
    let item_constraints = new Map();
    for(let item of data.items) {
        for(let quality = 0; quality <= MAX_QUALITY_UNLOCKED; quality++) {
            let item_name = item.key;
            let item_variable = get_item_variable(item_name, quality);
            item_constraints.set(item_variable, 0);
        }
    }
    let output_item = get_item_variable(OUTPUT_ITEM_NAME, 4);
    item_constraints.set(output_item, OUTPUT_AMOUNT);

    // setup inputs
    let input_name = get_item_variable(INPUT_ITEM_NAME, 0);
    let input_variable = `free_input__item=${input_name}`;
    item_variables.get(input_name).push({
        name: input_variable,
        coef: (1.0)*INPUT_COST
    });
    variable_costs.set(input_variable, INPUT_COST);

    // set recipes

    // setup crafting recipes
    for(let recipe of data.recipes) {
        for(let starting_quality = 0; starting_quality <= MAX_QUALITY_UNLOCKED; starting_quality++) {
            let num_allowed_prod_modules = recipe.allow_productivity ? NUM_MODULE_SLOTS : 0;
            for(let num_prod_modules = 0; num_prod_modules <= num_allowed_prod_modules; num_prod_modules++) {
                let num_quality_modules = NUM_MODULE_SLOTS - num_prod_modules;
                let recipe_name = recipe.key;
                let recipe_variable = get_solver_variable(recipe_name, starting_quality, num_prod_modules, num_quality_modules)

                for(let ingredient of recipe.ingredients) {
                    let ingredient_name = ingredient.name;
                    let ingredient_variable = get_item_variable(ingredient_name, starting_quality);
                    let ingredient_amount = ingredient.amount;
                    item_variables.get(ingredient_variable).push({
                        name: recipe_variable,
                        coef: (-1.0)*ingredient_amount
                    });
                }

                for(let result of recipe.results) {
                    let result_name = result.name;
                    let result_base_amount = result.amount;
                    for(let ending_quality = starting_quality; ending_quality <= MAX_QUALITY_UNLOCKED; ending_quality++) {
                        let result_variable = get_item_variable(result_name, ending_quality);
                        let total_prod_factor = 1.0 + (num_prod_modules * PROD_BONUS);
                        let total_quality_factor = calculate_quality_probability_factor(starting_quality, ending_quality, MAX_QUALITY_UNLOCKED, num_quality_modules*QUALITY_PROBABILITY);
                        let result_amount = result_base_amount * total_prod_factor * total_quality_factor;
                        item_variables.get(result_variable).push({
                            name: recipe_variable,
                            coef: result_amount
                        });
                    }
                }

                variable_costs.set(recipe_variable, RECIPE_COST);
            }
        }
    }

    let formatted_variable_costs = [];
    variable_costs.forEach( (value, key, map) => {
        formatted_variable_costs.push({
            name: key,
            coef: value
        })
    });

    let formatted_item_variables = [];
    item_variables.forEach( (value, key, map) => {
        formatted_item_variables.push({
            name: key,
            vars: value,
            bnds: {
                type: glpk.GLP_FX,
                ub: item_constraints.get(key),
                lb: item_constraints.get(key)
            }
        })
    });

    const lp = {
        name: 'LP',
        objective: {
            direction: glpk.GLP_MIN,
            name: 'obj',
            vars: formatted_variable_costs
        },
        subjectTo: formatted_item_variables
    }

    const opt = {
        msglev: glpk.GLP_MSG_OFF
    };

    glpk.solve(lp, opt)
        .then(res => print(res))
        .catch(err => console.log(err));

    console.log(await glpk.solve(lp, glpk.GLP_MSG_DBG));

    window.document.getElementById('cplex').innerHTML = await glpk.write(lp);
}

async function solve_glpk_example() {
    const glpk = await GLPK();

    const lp = {
        name: 'LP',
        objective: {
            direction: glpk.GLP_MAX,
            name: 'obj',
            vars: [
                { name: 'x1', coef: 0.6 },
                { name: 'x2', coef: 0.5 }
            ]
        },
        subjectTo: [
            {
                name: 'cons1',
                vars: [
                    { name: 'x1', coef: 1.0 },
                    { name: 'x2', coef: 2.0 }
                ],
                bnds: { type: glpk.GLP_UP, ub: 1.0, lb: 0.0 }
            },
            {
                name: 'cons2',
                vars: [
                    { name: 'x1', coef: 3.0 },
                    { name: 'x2', coef: 1.0 }
                ],
                bnds: { type: glpk.GLP_UP, ub: 2.0, lb: 0.0 }
            }
        ]
    };

    const opt = {
        msglev: glpk.GLP_MSG_OFF
    };

    glpk.solve(lp, opt)
        .then(res => print(res))
        .catch(err => console.log(err));

    console.log(await glpk.solve(lp, glpk.GLP_MSG_DBG));

    window.document.getElementById('cplex').innerHTML = await glpk.write(lp);
}

//window.document.getElementById('solve').onclick = solve_glpk_example;
window.document.getElementById('solve').onclick = solve_simple_factorio;
