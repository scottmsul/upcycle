import { add_input_item, add_output_item } from "./itemTables.js";
import { SOLVER_TAB_BUTTON_ID, SOLVER_TAB_ID, PREFERENCES_TAB_BUTTON_ID, PREFERENCES_TAB_ID } from "./constants.js";

export function initialize_ui() {
    // run these each once to have some starting items
    add_input_item();
    add_output_item();
    initialize_tabs();
}

function initialize_tabs() {
    let solver_tab = document.getElementById(SOLVER_TAB_ID);
    let preferences_tab = document.getElementById(PREFERENCES_TAB_ID);
    let tabs = [solver_tab, preferences_tab];

    let set_tab = (selected_tab_id) => {
        for(let tab of tabs) {
            if(tab.id == selected_tab_id) {
                tab.style.setProperty('display', 'block');
            } else {
                tab.style.setProperty('display', 'none');
            }
        }
    };

    document.getElementById(SOLVER_TAB_BUTTON_ID).onclick = () => set_tab(SOLVER_TAB_ID);
    document.getElementById(PREFERENCES_TAB_BUTTON_ID).onclick = () => set_tab(PREFERENCES_TAB_ID);
}
