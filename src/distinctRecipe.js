export class DistinctRecipe {
    constructor(recipe_key, recipe_quality, num_prod_modules, num_quality_modules) {
        this.recipe_key = recipe_key;
        this.recipe_quality = recipe_quality;
        this.num_prod_modules = num_prod_modules;
        this.num_quality_modules = num_quality_modules;
    }

    get key() {
        return `recipe_key=${this.recipe_key}__recipe_quality=${this.recipe_quality}__num_prod_modules=${this.num_prod_modules}__num_quality_modules=${this.num_quality_modules}`;
    }
}
