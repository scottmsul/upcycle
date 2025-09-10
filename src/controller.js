import { SolverInput } from "./model/solverInput.js";
import { ALLOW_BYPRODUCTS_INPUT_ID, BEACON_QUALITY_SELECT_ID, CHECK_SPEED_BEACONS_INPUT_ID, CRAFTING_MACHINE_COST_INPUT_ID, CRAFTING_MACHINE_QUALITY_SELECT_ID, INPUT_ITEMS_TABLE_ID, MAX_BEACONED_SPEED_MODULES_INPUT_ID, MAX_QUALITY_UNLOCKED_SELECT_ID, OUTPUT_ITEMS_TABLE_ID, PLANETS_TABLE_ID, PROD_MODULE_COST_INPUT_ID, PROD_MODULE_QUALITY_SELECT_ID, PROD_MODULE_TIER_SELECT_ID, PRODUCTIVITY_RESEARCH_TABLE_ID, QUALITY_MODULE_COST_INPUT_ID, QUALITY_MODULE_QUALITY_SELECT_ID, QUALITY_MODULE_TIER_SELECT_ID, RESOURCES_TABLE_ID, SPEED_MODULE_QUALITY_SELECT_ID, SPEED_MODULE_TIER_SELECT_ID } from "./ui/constants.js";
import { add_table_row, get_item_table_data } from "./ui/itemTables.js";
import { get_planets_table_data } from "./ui/planets.js";
import { get_productivity_research_table_data } from "./ui/productivityResearch.js";
import { update_quality_selectors_to_max_quality } from "./ui/quality.js";
import { display_resources, get_resources_table_data } from "./ui/resources.js";
import { OUTPUT_ITEMS_KEY, MAX_QUALITY_UNLOCKED_KEY, CRAFTING_MACHINE_QUALITY_KEY, CRAFTING_MACHINE_COST_KEY, ALLOW_BYPRODUCTS_KEY, QUALITY_MODULE_TIER_KEY, QUALITY_MODULE_QUALITY_KEY, QUALITY_MODULE_COST_KEY, PROD_MODULE_TIER_KEY, PROD_MODULE_QUALITY_KEY, PROD_MODULE_COST_KEY, CHECK_SPEED_BEACONS_KEY, SPEED_MODULE_TIER_KEY, SPEED_MODULE_QUALITY_KEY, SPEED_BEACON_QUALITY_KEY, MAX_BEACONED_SPEED_MODULES_KEY, PRODUCTIVITY_RESEARCH_KEY, PLANETS_KEY, RESOURCES_KEY, INPUT_ITEMS_KEY, DEFAULT_INPUT_ITEM_ID, DEFAULT_INPUT_ITEM_QUALITY_TYPE, DEFAULT_INPUT_ITEM_COST, DEFAULT_OUTPUT_ITEM_QUALITY_TYPE, DEFAULT_OUTPUT_AMOUNT_PER_SECOND, DEFAULT_OUTPUT_ITEM_ID, MIN_QUALITY_TYPE } from './model/constants.js';

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
            [CRAFTING_MACHINE_QUALITY_SELECT_ID, (e) => this.solver_input.set_value(CRAFTING_MACHINE_QUALITY_KEY, parseInt(e.target.value))],
            [CRAFTING_MACHINE_COST_INPUT_ID, (e) => this.solver_input.set_value(CRAFTING_MACHINE_COST_KEY, parseFloat(e.target.value))],
            [ALLOW_BYPRODUCTS_INPUT_ID, (e) => this.solver_input.set_value(ALLOW_BYPRODUCTS_KEY, e.target.checked)],
            [QUALITY_MODULE_TIER_SELECT_ID, (e) => this.solver_input.set_value(QUALITY_MODULE_TIER_KEY, parseInt(e.target.value))],
            [QUALITY_MODULE_QUALITY_SELECT_ID, (e) => this.solver_input.set_value(QUALITY_MODULE_QUALITY_KEY, parseInt(e.target.value))],
            [QUALITY_MODULE_COST_INPUT_ID, (e) => this.solver_input.set_value(QUALITY_MODULE_COST_KEY, parseFloat(e.target.value))],
            [PROD_MODULE_TIER_SELECT_ID, (e) => this.solver_input.set_value(PROD_MODULE_TIER_KEY, parseInt(e.target.value))],
            [PROD_MODULE_QUALITY_SELECT_ID, (e) => this.solver_input.set_value(PROD_MODULE_QUALITY_KEY, parseInt(e.target.value))],
            [PROD_MODULE_COST_INPUT_ID, (e) => this.solver_input.set_value(PROD_MODULE_COST_KEY, parseFloat(e.target.value))],
            [CHECK_SPEED_BEACONS_INPUT_ID, (e) => this.solver_input.set_value(CHECK_SPEED_BEACONS_KEY, e.target.checked)],
            [SPEED_MODULE_TIER_SELECT_ID, (e) => this.solver_input.set_value(SPEED_MODULE_TIER_KEY, parseInt(e.target.value))],
            [SPEED_MODULE_QUALITY_SELECT_ID, (e) => this.solver_input.set_value(SPEED_MODULE_QUALITY_KEY, parseInt(e.target.value))],
            [BEACON_QUALITY_SELECT_ID, (e) => this.solver_input.set_value(SPEED_BEACON_QUALITY_KEY, parseInt(e.target.value))],
            [MAX_BEACONED_SPEED_MODULES_INPUT_ID, (e) => this.solver_input.set_value(MAX_BEACONED_SPEED_MODULES_KEY, parseInt(e.target.value))],
            [PRODUCTIVITY_RESEARCH_TABLE_ID, (e) => this.solver_input.set_value(PRODUCTIVITY_RESEARCH_KEY, get_productivity_research_table_data())],
            [PLANETS_TABLE_ID, (e) => {
                let planets = get_planets_table_data();
                this.solver_input.set_value(PLANETS_KEY, planets);
                display_resources(this.solver_input.resources, planets);
            }],
            [RESOURCES_TABLE_ID, (e) => this.solver_input.set_value(RESOURCES_KEY, get_resources_table_data())],
            [INPUT_ITEMS_TABLE_ID, (e) => this.solver_input.set_value(INPUT_ITEMS_KEY, get_item_table_data(INPUT_ITEMS_TABLE_ID))]
        ];

        for(let [table_id, event_listener] of event_listeners) {
            window.document.getElementById(table_id).addEventListener('change', event_listener);
        }

        window.document.getElementById('add-input-item').onclick = (() => {
            let quality = DEFAULT_INPUT_ITEM_QUALITY_TYPE == MIN_QUALITY_TYPE ? 0 : this.solver_input.max_quality_unlocked;
            add_table_row(INPUT_ITEMS_TABLE_ID, DEFAULT_INPUT_ITEM_ID, quality, DEFAULT_INPUT_ITEM_COST);
        });

        window.document.getElementById('add-output-item').onclick = (() => {
            let quality = DEFAULT_OUTPUT_ITEM_QUALITY_TYPE == MIN_QUALITY_TYPE ? 0 : this.solver_input.max_quality_unlocked;
            add_table_row(OUTPUT_ITEMS_TABLE_ID, DEFAULT_OUTPUT_ITEM_ID, quality, DEFAULT_OUTPUT_AMOUNT_PER_SECOND);
        });

    }
}
