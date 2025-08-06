export function get_value(element_id) {
    return document.getElementById(element_id).value;
}

export function append_new(parent_element, child_type) {
    let child_element = document.createElement(child_type);
    parent_element.appendChild(child_element);
    return child_element;
}

export function append_new_set(parent_element, child_type, child_inner_html) {
    let child_element = document.createElement(child_type);
    child_element.innerHTML = child_inner_html;
    parent_element.appendChild(child_element);
    return child_element;
}
