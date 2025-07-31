export class ParsedData {
    /**
     * Contains all the same information that is in a Factorio raw data object,
     * but it is stored in a way that makes data easier to access.
     */
    constructor(data) {
        this.recipes = new Map();
        for(let recipe of data.recipes) {
            this.recipes.set(recipe.key, recipe);
        }
    }

    recipe(recipe_key) {
        return this.recipes.get(recipe_key);
    }
}
