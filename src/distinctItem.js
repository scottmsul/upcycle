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
