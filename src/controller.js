import { SolverInput } from "./model/solverInput.js";
import { ADD_INPUT_ITEM_BUTTON_ID, ADD_OUTPUT_ITEM_BUTTON_ID, ADD_RECIPE_BUTTON_ID, ALLOW_BYPRODUCTS_INPUT_ID, BEACON_QUALITY_SELECT_ID, BLACKLIST_RECIPES_INPUT_ID, CHECK_SPEED_BEACONS_INPUT_ID, CRAFTING_MACHINES_TABLE_ID, INPUT_ITEMS_TABLE_ID, MAX_BEACONED_SPEED_MODULES_INPUT_ID, MAX_QUALITY_UNLOCKED_SELECT_ID, OUTPUT_ITEMS_TABLE_ID, PLANETS_TABLE_ID, PROD_MODULE_COST_INPUT_ID, PROD_MODULE_QUALITY_SELECT_ID, PROD_MODULE_TIER_SELECT_ID, PRODUCTIVITY_RESEARCH_TABLE_ID, QUALITY_MODULE_COST_INPUT_ID, QUALITY_MODULE_QUALITY_SELECT_ID, QUALITY_MODULE_TIER_SELECT_ID, RECIPES_TABLE_ID, RESOURCES_TABLE_ID, RUN_SOLVER_BUTTON_ID, SOLVER_SETUP_ID, SOLVER_STATUS_TEXT_COMPLETE, SOLVER_STATUS_TEXT_CURRENTLY_RUNNING, SOLVER_STATUS_TEXT_ERROR, SOLVER_STATUS_TEXT_NOT_RUN_YET, BEACONED_SPEED_MODULE_QUALITY_SELECT_ID, BEACONED_SPEED_MODULE_TIER_SELECT_ID, WHITELIST_RECIPES_INPUT_ID, SPEED_MODULE_TIER_SELECT_ID, SPEED_MODULE_QUALITY_SELECT_ID, SPEED_MODULE_COST_INPUT_ID } from "./ui/constants.js";
import { add_item_table_row, get_item_table_data } from "./ui/itemTables.js";
import { get_planets_table_data } from "./ui/planets.js";
import { get_productivity_research_table_data } from "./ui/productivityResearch.js";
import { update_quality_selectors_to_max_quality } from "./ui/quality.js";
import { display_resources, get_resources_table_data } from "./ui/resources.js";
import { OUTPUT_ITEMS_KEY, MAX_QUALITY_UNLOCKED_KEY, ALLOW_BYPRODUCTS_KEY, QUALITY_MODULE_TIER_KEY, QUALITY_MODULE_QUALITY_KEY, QUALITY_MODULE_COST_KEY, PROD_MODULE_TIER_KEY, PROD_MODULE_QUALITY_KEY, PROD_MODULE_COST_KEY, CHECK_SPEED_BEACONS_KEY, BEACONED_SPEED_MODULE_TIER_KEY, BEACONED_SPEED_MODULE_QUALITY_KEY, BEACON_QUALITY_KEY, MAX_BEACONED_SPEED_MODULES_KEY, PRODUCTIVITY_RESEARCH_KEY, PLANETS_KEY, RESOURCES_KEY, INPUT_ITEMS_KEY, DEFAULT_INPUT_ITEM_ID, DEFAULT_INPUT_ITEM_QUALITY_TYPE, DEFAULT_INPUT_ITEM_COST, DEFAULT_OUTPUT_ITEM_QUALITY_TYPE, DEFAULT_OUTPUT_AMOUNT_PER_SECOND, DEFAULT_OUTPUT_ITEM_ID, MIN_QUALITY_TYPE, DEFAULT_RECIPE_KEY, WHITELIST_RECIPES_KEY, RECIPES_KEY, CRAFTING_MACHINES_KEY, SPEED_MODULE_TIER_KEY, SPEED_MODULE_QUALITY_KEY, SPEED_MODULE_COST_KEY } from './model/constants.js';
import { add_recipe_table_row, get_recipe_table_data } from "./ui/recipes.js";
import { get_crafting_machines_table_data } from "./ui/craftingMachines.js";
import { run_solver } from "./solver.js";
import { display_results, hide_results } from "./ui/results.js";
import { set_solver_status } from "./ui/util.js";

export class Controller {
    constructor() {
        this.solver_input = new SolverInput();

        // note that change events bubble up the DOM tree
        let event_listeners = [
            [OUTPUT_ITEMS_TABLE_ID, (e) => this.solver_input.set_value(OUTPUT_ITEMS_KEY, get_item_table_data(OUTPUT_ITEMS_TABLE_ID))],
            [MAX_QUALITY_UNLOCKED_SELECT_ID, (e) => {
                let new_max_quality_unlocked = parseInt(e.target.value);
                this.solver_input.set_value(MAX_QUALITY_UNLOCKED_KEY, new_max_quality_unlocked);
                update_quality_selectors_to_max_quality(new_max_quality_unlocked);
            }],
            [ALLOW_BYPRODUCTS_INPUT_ID, (e) => this.solver_input.set_value(ALLOW_BYPRODUCTS_KEY, e.target.checked)],
            [CRAFTING_MACHINES_TABLE_ID, (e) => this.solver_input.set_value(CRAFTING_MACHINES_KEY, get_crafting_machines_table_data())],
            [QUALITY_MODULE_TIER_SELECT_ID, (e) => this.solver_input.set_value(QUALITY_MODULE_TIER_KEY, parseInt(e.target.value))],
            [QUALITY_MODULE_QUALITY_SELECT_ID, (e) => this.solver_input.set_value(QUALITY_MODULE_QUALITY_KEY, parseInt(e.target.value))],
            [QUALITY_MODULE_COST_INPUT_ID, (e) => this.solver_input.set_value(QUALITY_MODULE_COST_KEY, parseFloat(e.target.value))],
            [PROD_MODULE_TIER_SELECT_ID, (e) => this.solver_input.set_value(PROD_MODULE_TIER_KEY, parseInt(e.target.value))],
            [PROD_MODULE_QUALITY_SELECT_ID, (e) => this.solver_input.set_value(PROD_MODULE_QUALITY_KEY, parseInt(e.target.value))],
            [PROD_MODULE_COST_INPUT_ID, (e) => this.solver_input.set_value(PROD_MODULE_COST_KEY, parseFloat(e.target.value))],
            [SPEED_MODULE_TIER_SELECT_ID, (e) => this.solver_input.set_value(SPEED_MODULE_TIER_KEY, parseInt(e.target.value))],
            [SPEED_MODULE_QUALITY_SELECT_ID, (e) => this.solver_input.set_value(SPEED_MODULE_QUALITY_KEY, parseInt(e.target.value))],
            [SPEED_MODULE_COST_INPUT_ID, (e) => this.solver_input.set_value(SPEED_MODULE_COST_KEY, parseFloat(e.target.value))],
            [CHECK_SPEED_BEACONS_INPUT_ID, (e) => this.solver_input.set_value(CHECK_SPEED_BEACONS_KEY, e.target.checked)],
            [BEACONED_SPEED_MODULE_TIER_SELECT_ID, (e) => this.solver_input.set_value(BEACONED_SPEED_MODULE_TIER_KEY, parseInt(e.target.value))],
            [BEACONED_SPEED_MODULE_QUALITY_SELECT_ID, (e) => this.solver_input.set_value(BEACONED_SPEED_MODULE_QUALITY_KEY, parseInt(e.target.value))],
            [BEACON_QUALITY_SELECT_ID, (e) => this.solver_input.set_value(BEACON_QUALITY_KEY, parseInt(e.target.value))],
            [MAX_BEACONED_SPEED_MODULES_INPUT_ID, (e) => this.solver_input.set_value(MAX_BEACONED_SPEED_MODULES_KEY, parseInt(e.target.value))],
            [PRODUCTIVITY_RESEARCH_TABLE_ID, (e) => this.solver_input.set_value(PRODUCTIVITY_RESEARCH_KEY, get_productivity_research_table_data())],
            [PLANETS_TABLE_ID, (e) => {
                let planets = get_planets_table_data();
                this.solver_input.set_value(PLANETS_KEY, planets);
                display_resources(this.solver_input.resources, planets);
            }],
            [RESOURCES_TABLE_ID, (e) => this.solver_input.set_value(RESOURCES_KEY, get_resources_table_data())],
            [INPUT_ITEMS_TABLE_ID, (e) => this.solver_input.set_value(INPUT_ITEMS_KEY, get_item_table_data(INPUT_ITEMS_TABLE_ID))],

            // radio buttons don't fire events when unchecked, only when checked
            [WHITELIST_RECIPES_INPUT_ID, (e) => this.solver_input.set_value(WHITELIST_RECIPES_KEY, true)],
            [BLACKLIST_RECIPES_INPUT_ID, (e) => this.solver_input.set_value(WHITELIST_RECIPES_KEY, false)],

            [RECIPES_TABLE_ID, (e) => this.solver_input.set_value(RECIPES_KEY, get_recipe_table_data())]
        ];

        for(let [table_id, event_listener] of event_listeners) {
            window.document.getElementById(table_id).addEventListener('change', event_listener);
        }

        window.document.getElementById(ADD_INPUT_ITEM_BUTTON_ID).onclick = (() => {
            let quality = DEFAULT_INPUT_ITEM_QUALITY_TYPE == MIN_QUALITY_TYPE ? 0 : this.solver_input.max_quality_unlocked;
            add_item_table_row(INPUT_ITEMS_TABLE_ID, DEFAULT_INPUT_ITEM_ID, quality, DEFAULT_INPUT_ITEM_COST);
        });

        window.document.getElementById(ADD_OUTPUT_ITEM_BUTTON_ID).onclick = (() => {
            let quality = DEFAULT_OUTPUT_ITEM_QUALITY_TYPE == MIN_QUALITY_TYPE ? 0 : this.solver_input.max_quality_unlocked;
            add_item_table_row(OUTPUT_ITEMS_TABLE_ID, DEFAULT_OUTPUT_ITEM_ID, quality, DEFAULT_OUTPUT_AMOUNT_PER_SECOND);
        });

        window.document.getElementById(ADD_RECIPE_BUTTON_ID).onclick = (() => {
            add_recipe_table_row(DEFAULT_RECIPE_KEY);
        });

        window.document.getElementById(SOLVER_SETUP_ID).addEventListener('change', () => {
            set_solver_status(SOLVER_STATUS_TEXT_NOT_RUN_YET);
        })

        window.document.getElementById(RUN_SOLVER_BUTTON_ID).onclick = (async () => {
            set_solver_status(SOLVER_STATUS_TEXT_CURRENTLY_RUNNING);
            const solve_result = await run_solver(this.solver_input);
            if(solve_result.success) {
                display_results(solve_result.solver_input, solve_result.solver, solve_result.glpk_output.result);
                set_solver_status(SOLVER_STATUS_TEXT_COMPLETE);
            } else {
                set_solver_status(SOLVER_STATUS_TEXT_ERROR);
                hide_results();
            }
        });
    }
}
