import { get_item_constraint_key } from "./solver.js";

// todo: put an ItemConstraint class here

class RecipeVariable {
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

export function get_all_producible_item_constraint_keys(parsed_data, preferences) {
    /**
     * An item constraint key is a unique item in the solver.
     * Generally this will be an item_id combined with a quality level.
     * Returns a set of all solver item constraint keys reachable from the given recipes.
     * Best to not use data.items because it contains some unproducible things.
     * Could be optimized to exclude unreachable recipes given a user's settings.
     */
    let item_constraint_keys = new Set();
    parsed_data.recipes.forEach( (recipe_data, recipe_key, map) => {
        for(let ingredient of recipe_data.ingredients) {
            let max_allowed_quality = parsed_data.items.get(ingredient.name).allows_quality ? preferences.max_quality_unlocked : 0;
            for(let quality = 0; quality <= max_allowed_quality; quality++) {
                let item_constraint_key = get_item_constraint_key(ingredient.name, quality);
                item_constraint_keys.add(item_constraint_key);
            }
        }
        for(let result of recipe_data.results) {
            let max_allowed_quality = parsed_data.items.get(result.name).allows_quality ? preferences.max_quality_unlocked : 0;
            for(let quality = 0; quality <= max_allowed_quality; quality++) {
                let item_constraint_key = get_item_constraint_key(result.name, quality);
                item_constraint_keys.add(item_constraint_key);
            }
        }
    });
    return item_constraint_keys;
}

export function get_all_recipe_variables(parsed_data, preferences) {
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
    parsed_data.recipes.forEach( (recipe_data, recipe_key, map) => {
        let max_recipe_quality = recipe_data.ingredients.some(o => parsed_data.items.get(o.name).allows_quality) ? preferences.max_quality_unlocked : 0;
        for(let recipe_quality = 0; recipe_quality <= max_recipe_quality; recipe_quality++) {
            let num_allowed_prod_modules = recipe_data.allow_productivity ? preferences.num_module_slots : 0;
            for(let num_prod_modules = 0; num_prod_modules <= num_allowed_prod_modules; num_prod_modules++) {
                // todo: get num_module_slots from the actual building
                let num_quality_modules = preferences.num_module_slots - num_prod_modules;
                let recipe_variable = new RecipeVariable(recipe_key, recipe_quality, num_prod_modules, num_quality_modules);
                recipe_variables.push(recipe_variable);
            }
        }
    })
    return recipe_variables;
}
