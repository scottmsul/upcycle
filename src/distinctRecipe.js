export class DistinctRecipe {
    constructor(recipe_key, recipe_quality, num_prod_modules, num_quality_modules, num_beaconed_speed_modules) {
        this.recipe_key = recipe_key;
        this.recipe_quality = recipe_quality;
        this.num_prod_modules = num_prod_modules;
        this.num_quality_modules = num_quality_modules;
        this.num_beaconed_speed_modules = num_beaconed_speed_modules;
    }

    get key() {
        return `recipe_key=${this.recipe_key}__recipe_quality=${this.recipe_quality}__num_prod_modules=${this.num_prod_modules}__num_quality_modules=${this.num_quality_modules}__num_beaconed_speed_modules=${this.num_beaconed_speed_modules}`;
    }
}
