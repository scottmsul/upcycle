export function float_from_string(s) {
    if(isNaN(s)) return null;
    let f = parseFloat(s);
    if(isNaN(f)) return null;
    return f;
}

export function int_from_string(s) {
    if(isNaN(s)) return null;
    let i = parseInt(s);
    if(isNaN(i)) return null;
    return i;
}
