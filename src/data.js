import { get_item_key } from "./solver.js";

export function get_all_producible_item_keys(data, preferences) {
    /**
     * Returns a set of all solver item keys reachable from recipes.
     * Note that solver item keys include quality information.
     * Best to not use data.items because it contains some unproducible things.
     * Could be optimized to exclude unreachable recipes given a user's settings.
     */
    let item_keys = new Set();
    for(let recipe of data.recipes) {
        for(let ingredient of recipe.ingredients) {
            for(let quality = 0; quality <= preferences.max_quality_unlocked; quality++) {
                let item_key = get_item_key(ingredient.name, quality);
                item_keys.add(item_key);
            }
        }
        for(let result of recipe.results) {
            for(let quality = 0; quality <= preferences.max_quality_unlocked; quality++) {
                let item_key = get_item_key(result.name, quality);
                item_keys.add(item_key);
            }
        }
    }
    return item_keys;
}
