import GLPK from '../packages/glpk.js/dist/index.js';
import { Solver } from './solver.js';
import { parsed_data } from './data.js';
import { initialize_ui } from './ui/initialize.js';
import { display_results } from './ui/results.js';
import { display_solver_input } from './ui/displaySolverInput.js';
import { Controller } from './controller.js';

initialize_ui();
let controller = new Controller();
display_solver_input(controller.solver_input);

function print(res) {
    const el = window.document.getElementById('out');
    el.innerHTML = `Solution: LP \n\n ${JSON.stringify(res, null, 2)}`;
};

async function solve_simple_factorio() {
    // start with simple ad-hoc example, abstract stuff later
    // one crafting recipe with one ingredient -> one product
    const glpk = await GLPK();

    let solver_input = controller.solver_input;
    let solver = new Solver(parsed_data, solver_input);

    // glpk-specific code
    let glpk_formatted_variable_costs = [];
    solver.variable_costs.forEach( (value, key, map) => {
        glpk_formatted_variable_costs.push({
            name: key,
            coef: value
        })
    });

    let glpk_formatted_item_variable_coefficients = [];
    solver.item_variable_coefficients.forEach( (coefficients, disinct_item_key, map1) => {
        let glpk_formatted_coefficients = [];
        coefficients.forEach( (coefficient, variable_key, map2) => {
            glpk_formatted_coefficients.push({
                name: variable_key,
                coef: coefficient
            });
        });
        glpk_formatted_item_variable_coefficients.push({
            name: disinct_item_key,
            vars: glpk_formatted_coefficients,
            bnds: {
                type: glpk.GLP_FX,
                ub: solver.distinct_item_constraints.get(disinct_item_key),
                lb: solver.distinct_item_constraints.get(disinct_item_key)
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

    const results = await glpk.solve(lp, opt);
    display_results(solver_input, solver, results.result.vars);

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
