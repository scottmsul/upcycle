export class DistinctItem {
    constructor(item_key, item_quality) {
        this.item_key = item_key
        this.item_quality = item_quality
    }

    get key() {
        return get_distinct_item_key(this.item_key, this.item_quality);
    }
}

export function get_distinct_item_key(item_key, item_quality) {
    return `item=${item_key}__quality=${item_quality}`;
}

//this function exists as part of a temporary refactor, and should be deleted afterwards
export function parse_distinct_item_key(distinct_item_key) {
    let s = distinct_item_key.split('__');
    let item_part = s[0];
    let quality_part = s[1];
    let item_key = item_part.split('=')[1];
    let item_quality = quality_part.split('=')[1];
    return new DistinctItem(item_key, item_quality);
}
