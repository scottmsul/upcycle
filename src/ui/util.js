export function get_int_value(element_id) {
    return parseInt(window.document.getElementById(element_id).value);
}

export function get_float_value(element_id) {
    return parseFloat(window.document.getElementById(element_id).value);
}

export function get_checkbox_value(element_id) {
    return window.document.getElementById(element_id).checked;
}
