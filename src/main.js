import GLPK from '../node_modules/glpk.js/dist/index.js';
import { get_item_constraints, get_item_variable_coefficients, get_variable_costs } from './solver.js';
//import { data, defaults } from './data/testData.js';
import { data, defaults } from './data/spaceAge2.0.11.js';
import { get_all_producible_item_constraint_keys, get_all_recipe_variables } from './data.js';
import { Preferences } from './preferences.js';
import { ParsedData } from './parsedData.js';
import { display_result, initialize_ui } from './ui.js';

let parsed_data = new ParsedData(data);
initialize_ui(parsed_data, defaults);

function print(res) {
    const el = window.document.getElementById('out');
    el.innerHTML = `Solution: LP \n\n ${JSON.stringify(res, null, 2)}`;
};

async function solve_simple_factorio() {
    // start with simple ad-hoc example, abstract stuff later
    // one crafting recipe with one ingredient -> one product
    const glpk = await GLPK();

    let preferences = new Preferences();

    let item_constraint_keys = get_all_producible_item_constraint_keys(parsed_data, preferences);
    let recipe_variables = get_all_recipe_variables(parsed_data, preferences);
    let item_constraints = get_item_constraints(item_constraint_keys, preferences);
    let item_variable_coefficients = get_item_variable_coefficients(item_constraint_keys, recipe_variables, parsed_data, preferences);
    let variable_costs = get_variable_costs(recipe_variables, preferences);

    // glpk-specific code
    let glpk_formatted_variable_costs = [];
    variable_costs.forEach( (value, key, map) => {
        glpk_formatted_variable_costs.push({
            name: key,
            coef: value
        })
    });

    let glpk_formatted_item_variable_coefficients = [];
    item_variable_coefficients.forEach( (coefficients, item_constraint_key, map1) => {
        let glpk_formatted_coefficients = [];
        coefficients.forEach( (coefficient, variable_key, map2) => {
            glpk_formatted_coefficients.push({
                name: variable_key,
                coef: coefficient
            });
        })
        glpk_formatted_item_variable_coefficients.push({
            name: item_constraint_key,
            vars: glpk_formatted_coefficients,
            bnds: {
                type: glpk.GLP_FX,
                ub: item_constraints.get(item_constraint_key),
                lb: item_constraints.get(item_constraint_key)
            }
        });
    });

    const lp = {
        name: 'LP',
        objective: {
            direction: glpk.GLP_MIN,
            name: 'obj',
            vars: glpk_formatted_variable_costs
        },
        subjectTo: glpk_formatted_item_variable_coefficients
    }

    const opt = {
        msglev: glpk.GLP_MSG_DBG
    };

    const result = await glpk.solve(lp, opt);
    display_result(result.result.vars);

    /*
    glpk.solve(lp, opt)
        .then(res => print(res))
        .catch(err => console.log(err));

    console.log(await glpk.solve(lp, glpk.GLP_MSG_DBG));

    window.document.getElementById('cplex').innerHTML = await glpk.write(lp);
    */
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
