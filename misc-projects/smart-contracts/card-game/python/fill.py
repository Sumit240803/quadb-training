import random
import os
import json

os.makedirs("metadata", exist_ok=True)

RARITY_MAP = {
    "Common": range(0, 10),
    "Rare": range(10, 15),
    "Epic": range(15, 18),
    "Legendary": range(18, 19)
}

RARITY_STATS = {
    "Common":    {"attack": (10, 30), "defense": (10, 30)},
    "Rare":      {"attack": (31, 60), "defense": (31, 60)},
    "Epic":      {"attack": (61, 85), "defense": (61, 85)},
    "Legendary": {"attack": (86, 100), "defense": (86, 100)}
}
def generate_card_metadata(card_id, rarity):
    attack_range = RARITY_STATS[rarity]["attack"]
    defense_range = RARITY_STATS[rarity]["defense"]

    return {
        "name": f"{rarity} Card #{card_id}",
        "description": f"A {rarity.lower()} card from the bytes realm.",
        "image": f"ipfs://images/img.png",
        "attributes": [
            { "trait_type": "Rarity", "value": rarity },
            { "trait_type": "Attack", "value": random.randint(*attack_range) },
            { "trait_type": "Defense", "value": random.randint(*defense_range) }
        ]
    }

for rarity, id_range in RARITY_MAP.items():
    for card_id in id_range:
        metadata = generate_card_metadata(card_id, rarity)
        with open(f"metadata/{card_id}.json", "w") as f:
            json.dump(metadata, f, indent=2)

