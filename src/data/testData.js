import { ParsedData } from "../parsedData.js";
import { MAX_QUALITY_TYPE, MIN_QUALITY_TYPE } from "../ui/constants.js";

export const defaults = {
    MAX_QUALITY_UNLOCKED: 4,
    INPUT_ITEM_ID: "item-1",
    INPUT_ITEM_QUALITY_TYPE: MIN_QUALITY_TYPE,
    INPUT_ITEM_COST: 1.0,
    OUTPUT_ITEM_ID: "item-2",
    OUTPUT_ITEM_QUALITY_TYPE: MAX_QUALITY_TYPE,
    OUTPUT_AMOUNT_PER_SECOND: 60.0
}

export const raw_data = {
    "crafting_machines": [
        {
            "key": "assembling-machine-3",
            "crafting_categories": ["crafting"],
            "crafting_speed": 1.25,
            "module_slots": 4,
            "prod_bonus": 0
        },
        {
            "key": "recycler",
            "crafting_categories": ["recycling"],
            "crafting_speed": 0.5,
            "module_slots": 4,
            "prod_bonus": 0
        }
    ],
    "items": [
        {
            "key": "item-1",
            "type": "item"
        },
        {
            "key": "item-2",
            "type": "item"
        }
    ],
    "recipes": [
        {
            "key": "craft-1-to-2",
            "category": "crafting",
            "allow_productivity": true,
            "energy_required": 1,
            "ingredients": [
                {
                    "name": "item-1",
                    "amount": 1
                }
            ],
            "results": [
                {
                    "name": "item-2",
                    "amount": 1
                }
            ]
        },
        {
            "key": "recycle-2-to-1",
            "category": "recycling",
            "allow_productivity": false,
            "energy_required": 0.25,
            "ingredients": [
                {
                    "name": "item-2",
                    "amount": 1
                }
            ],
            "results": [
                {
                    "name": "item-1",
                    "amount": 1,
                    "probability": 0.25
                }
            ]
        }
    ]
};

export const parsed_data = new ParsedData(data);
