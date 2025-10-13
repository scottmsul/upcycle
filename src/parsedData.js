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

        this.crafting_machines = new Map();
        this.crafting_categories = new Set();
        this.crafting_categories_to_crafting_machines = new Map();

        for(let crafting_machine of raw_data.crafting_machines) {
            this.crafting_machines.set(crafting_machine.key, crafting_machine);

            for(let crafting_category of crafting_machine.crafting_categories) {
                this.crafting_categories.add(crafting_category);

                if(!this.crafting_categories_to_crafting_machines.has(crafting_category)) {
                    this.crafting_categories_to_crafting_machines.set(crafting_category, [crafting_machine.key]);
                } else {
                    this.crafting_categories_to_crafting_machines.get(crafting_category).push(crafting_machine.key);
                }
            }
        }

        this.recipes = new Map();
        for(let recipe of raw_data.recipes) {
            // don't store recipes with items not in the items list (ie copper wire)
            // also don't store recipes with category not in the categories list (ie rocket part)
            if(recipe.ingredients.every(o => this.items.has(o.name))
                && recipe.results.every(o => this.items.has(o.name))
                && this.crafting_categories.has(recipe.category)) {
                this.recipes.set(recipe.key, recipe);
            }
        }

        this.planets = new Map();
        for(let planet of raw_data.planets) {
            this.planets.set(planet.key, planet);
        }

        // note the json data "resources" only includes mining and pumpjacks,
        // whereas the UI's "resources" also includes plants, offshore, and asteroids
        this.resources = new Map();
        for(let resource of raw_data.resources) {
            this.resources.set(resource.key, resource);
        }

        this.plants = new Map();
        for(let plant of raw_data.plants) {
            this.plants.set(plant.key, plant);
        }

        this.surface_properties = new Map();
        for(let surface_property of raw_data.surface_properties) {
            this.surface_properties.set(surface_property.name, surface_property);
        }
    }

    recipe(recipe_key) {
        return this.recipes.get(recipe_key);
    }

    item(item_key) {
        return this.items.get(item_key);
    }

    planet(planet_key) {
        return this.planets.get(planet_key);
    }

    resource(resource_key) {
        return this.resources.get(resource_key);
    }

    plant(plant_key) {
        return this.plants.get(plant_key);
    }

    surface_property(surface_property_key) {
        return this.surface_properties.get(surface_property_key);
    }
}
