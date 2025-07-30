export function get_item_key(item_name, item_quality) {
    return `item=${item_name}__quality=${item_quality}`;
}

export function get_recipe_variable_key(recipe_name, starting_quality, num_prod_modules, num_quality_modules) {
    return `recipe=${recipe_name}__starting_quality=${starting_quality}__num_prod_modules=${num_prod_modules}__num_quality_modules=${num_quality_modules}`;
}

