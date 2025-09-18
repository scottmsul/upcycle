import { SOLVER_STATUS_TEXT_ID } from "./constants.js";

export function get_int_value(element_id) {
    return parseInt(window.document.getElementById(element_id).value);
}

export function get_float_value(element_id) {
    return parseFloat(window.document.getElementById(element_id).value);
}

export function get_checkbox_value(element_id) {
    return window.document.getElementById(element_id).checked;
}

export function make_numeric_input(default_value) {
    let input_element = document.createElement('input');
    input_element.setAttribute('type', 'number');
    input_element.value = default_value;
    return input_element;
}

export function set_solver_status(status_text) {
    let solver_status_element = window.document.getElementById(SOLVER_STATUS_TEXT_ID);
    solver_status_element.innerHTML = status_text;
}
