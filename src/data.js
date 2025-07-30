import { get_item_key } from "./solver.js";

class RecipeVariable {
    constructor(recipe_key, ingredient_quality, num_prod_modules, num_quality_modules) {
        this.recipe_key = recipe_key;
        this.ingredient_quality = ingredient_quality;
        this.num_prod_modules = num_prod_modules;
        this.num_quality_modules = num_quality_modules;
    }

    get key() {
        return `recipe_key=${this.recipe_key}__ingredient_quality=${this.ingredient_quality}__num_prod_modules=${this.num_prod_modules}__num_quality_modules=${this.num_quality_modules}`;
    }
}

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

export function get_all_recipe_variables(data, preferences) {
    /**
     * Returns a list of RecipeVariable objects
     * In this context, each returned recipe will correspond to a single solver variable,
     * which represent every unique combination of input quality and prod/qual modules.
     * We don't bother checking empty module slots or module slots with speed modules,
     * even though in some cases these might be optimal, due to the combinatorial blow-up.
     * If a recipe doesn't allow productivity, we always max it out with quality modules.
     * This function is mainly for identifying all the different combinations,
     * with the logic for calculating true input/output amounts and solver costs later on.
     * Fluid handling to be added later.
     */
    let recipe_variables = [];
    for(let recipe of data.recipes) {
        for(let ingredient_quality = 0; ingredient_quality <= preferences.max_quality_unlocked; ingredient_quality++) {
            let num_allowed_prod_modules = recipe.allow_productivity ? preferences.num_module_slots : 0;
            for(let num_prod_modules = 0; num_prod_modules <= num_allowed_prod_modules; num_prod_modules++) {
                // todo: get num_module_slots from the actual building
                let num_quality_modules = preferences.num_module_slots - num_prod_modules;
                let recipe_variable = new RecipeVariable(recipe.key, ingredient_quality, num_prod_modules, num_quality_modules);
                recipe_variables.push(recipe_variable);
            }
        }
    }
    return recipe_variables;
}
