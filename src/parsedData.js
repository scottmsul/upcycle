export class ParsedData {
    /**
     * Contains all the same information that is in a Factorio raw data object,
     * but it is stored in a way that makes data easier to access.
     */
    constructor(raw_data) {
        this.items = new Map();
        for(let item of raw_data.items) {
            item.allows_quality = (!(item.type == 'fluid'));
            this.items.set(item.key, item);
        }

        this.recipes = new Map();
        for(let recipe of raw_data.recipes) {
            // don't store recipes with items not in the items list (ie copper wire)
            if(recipe.ingredients.every(o => this.items.has(o.name))
                && recipe.results.every(o => this.items.has(o.name))) {
                this.recipes.set(recipe.key, recipe);
            }
        }
    }

    recipe(recipe_key) {
        return this.recipes.get(recipe_key);
    }

    item(item_key) {
        return this.items.get(item_key);
    }
}
