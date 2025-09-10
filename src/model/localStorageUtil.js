export function getLocalStorageInt(key, min, max, default_value) {
    let curr_value_str = localStorage.getItem(key);
    if((curr_value_str === null) || isNaN(curr_value_str)) return default_value;
    let curr_value_int = parseInt(curr_value_str, 10);
    if(isNaN(curr_value_int) || (curr_value_int < min) || (curr_value_int > max)) return default_value;
    return curr_value_int;
}

export function getLocalStorageFloat(key, default_value) {
    let curr_value_str = localStorage.getItem(key);
    if((curr_value_str === null) || isNaN(curr_value_str)) return default_value;
    let curr_value_float = parseFloat(curr_value_str);
    if(isNaN(curr_value_float)) return default_value;
    return curr_value_float;
}

export function getLocalStorageBoolean(key, default_value) {
    let curr_value_str = localStorage.getItem(key);
    if(curr_value_str === 'true') return true;
    if(curr_value_str === 'false') return false;
    return default_value;
}

export function getLocalStorageObject(key, parser, default_value) {
    let curr_value_str = localStorage.getItem(key);
    if(curr_value_str === null) return default_value;
    let obj = parser(curr_value_str);
    if(obj === null) return default_value;
    return obj;
}
