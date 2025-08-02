export class ParsedData {
    /**
     * Contains all the same information that is in a Factorio raw data object,
     * but it is stored in a way that makes data easier to access.
     */
    constructor(raw_data) {
        this.recipes = new Map();
        for(let recipe of raw_data.recipes) {
            this.recipes.set(recipe.key, recipe);
        }

        // could filter this down to only items that are producible from recipes
        this.items = new Map();
        for(let item of raw_data.items) {
            this.items.set(item.key, item);
        }
    }

    recipe(recipe_key) {
        return this.recipes.get(recipe_key);
    }

    item(item_key) {
        return this.items.get(item_key);
    }
}
