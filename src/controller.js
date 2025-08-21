import { SolverInput } from "./model/solverInput.js";
import { ALLOW_BYPRODUCTS_INPUT_ID, BEACON_QUALITY_SELECT_ID, CHECK_SPEED_BEACONS_INPUT_ID, CRAFTING_MACHINE_COST_INPUT_ID, CRAFTING_MACHINE_QUALITY_SELECT_ID, INPUT_ITEMS_TABLE_ID, MAX_BEACONED_SPEED_MODULES_INPUT_ID, MAX_QUALITY_UNLOCKED_SELECT_ID, OUTPUT_ITEMS_TABLE_ID, PLANETS_TABLE_ID, PROD_MODULE_COST_INPUT_ID, PROD_MODULE_QUALITY_SELECT_ID, PROD_MODULE_TIER_SELECT_ID, PRODUCTIVITY_RESEARCH_TABLE_ID, QUALITY_MODULE_COST_INPUT_ID, QUALITY_MODULE_QUALITY_SELECT_ID, QUALITY_MODULE_TIER_SELECT_ID, RESOURCES_TABLE_ID, SPEED_MODULE_QUALITY_SELECT_ID, SPEED_MODULE_TIER_SELECT_ID } from "./ui/constants.js";
import { get_item_table_data } from "./ui/itemTables.js";
import { get_planets_table_data } from "./ui/planets.js";
import { get_productivity_research_table_data } from "./ui/productivityResearch.js";
import { get_resources_table_data } from "./ui/resources.js";

export class Controller {
    constructor() {
        this.solver_input = new SolverInput();

        // note that change events bubble up the DOM tree
        let element_response_map = [
            [OUTPUT_ITEMS_TABLE_ID, (e) => this.solver_input.output_items = get_item_table_data(OUTPUT_ITEMS_TABLE_ID)],
            [MAX_QUALITY_UNLOCKED_SELECT_ID, (e) => this.solver_input.max_quality_unlocked = parseInt(e.target.value)],
            [CRAFTING_MACHINE_QUALITY_SELECT_ID, (e) => this.solver_input.crafting_machine_quality = parseInt(e.target.value)],
            [CRAFTING_MACHINE_COST_INPUT_ID, (e) => this.solver_input.crafting_machine_cost = parseFloat(e.target.value)],
            [ALLOW_BYPRODUCTS_INPUT_ID, (e) => this.solver_input.allow_byproducts = e.target.checked],
            [QUALITY_MODULE_TIER_SELECT_ID, (e) => this.solver_input.quality_module_tier = parseInt(e.target.value)],
            [QUALITY_MODULE_QUALITY_SELECT_ID, (e) => this.solver_input.quality_module_quality = parseInt(e.target.value)],
            [QUALITY_MODULE_COST_INPUT_ID, (e) => this.solver_input.quality_module_cost = parseFloat(e.target.value)],
            [PROD_MODULE_TIER_SELECT_ID, (e) => this.solver_input.prod_module_tier = parseInt(e.target.value)],
            [PROD_MODULE_QUALITY_SELECT_ID, (e) => this.solver_input.prod_module_quality = parseInt(e.target.value)],
            [PROD_MODULE_COST_INPUT_ID, (e) => this.solver_input.prod_module_cost = parseFloat(e.target.value)],
            [CHECK_SPEED_BEACONS_INPUT_ID, (e) => this.solver_input.check_speed_beacons = e.target.checked],
            [SPEED_MODULE_TIER_SELECT_ID, (e) => this.solver_input.speed_module_tier = parseInt(e.target.value)],
            [SPEED_MODULE_QUALITY_SELECT_ID, (e) => this.solver_input.speed_module_quality = parseInt(e.target.value)],
            [BEACON_QUALITY_SELECT_ID, (e) => this.solver_input.speed_beacon_quality = parseInt(e.target.value)],
            [MAX_BEACONED_SPEED_MODULES_INPUT_ID, (e) => this.solver_input.max_beaconed_speed_modules = parseInt(e.target.value)],
            [PRODUCTIVITY_RESEARCH_TABLE_ID, (e) => this.solver_input.productivity_research = get_productivity_research_table_data()],
            [PLANETS_TABLE_ID, (e) => this.solver_input.planets = get_planets_table_data()],
            [RESOURCES_TABLE_ID, (e) => this.solver_input.resources = get_resources_table_data()],
            [INPUT_ITEMS_TABLE_ID, (e) => this.solver_input.input_items = get_item_table_data(INPUT_ITEMS_TABLE_ID)]
        ];

        for(let [table_id, event_listener] of element_response_map) {
            window.document.getElementById(table_id).addEventListener('change', event_listener);
        }
    }
}
