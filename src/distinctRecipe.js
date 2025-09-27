export class DistinctRecipe {
    constructor(recipe_key, recipe_quality, crafting_machine_key, num_prod_modules, num_quality_modules, num_speed_modules, num_beaconed_speed_modules) {
        this.recipe_key = recipe_key;
        this.recipe_quality = recipe_quality;
        this.crafting_machine_key = crafting_machine_key;
        this.num_prod_modules = num_prod_modules;
        this.num_quality_modules = num_quality_modules;
        this.num_speed_modules = num_speed_modules;
        this.num_beaconed_speed_modules = num_beaconed_speed_modules;
    }

    get key() {
        return `recipe_key=${this.recipe_key}__recipe_quality=${this.recipe_quality}__crafting_machine=${this.crafting_machine_key}__num_prod_modules=${this.num_prod_modules}__num_quality_modules=${this.num_quality_modules}__num_speed_modules=${this.num_speed_modules}__num_beaconed_speed_modules=${this.num_beaconed_speed_modules}`;
    }
}
