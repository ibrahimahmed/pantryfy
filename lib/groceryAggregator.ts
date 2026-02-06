import { SavedRecipe } from "@/types/recipe";
import { GroceryItem, GroceryCategory } from "@/types/grocery";
import { normalizeIngredientName } from "./ingredientNormalizer";
import { categorizeIngredient } from "./categoryClassifier";

export function aggregateGroceryList(recipes: SavedRecipe[]): GroceryItem[] {
  const itemMap = new Map<string, GroceryItem>();

  for (const recipe of recipes) {
    for (const ing of recipe.ingredients) {
      const normalizedName = normalizeIngredientName(ing.name);
      const key = normalizedName;

      if (itemMap.has(key)) {
        const existing = itemMap.get(key)!;
        if (existing.unit === ing.unit) {
          existing.quantity += ing.quantity;
        }
        if (!existing.fromRecipes.includes(recipe.title)) {
          existing.fromRecipes.push(recipe.title);
        }
      } else {
        itemMap.set(key, {
          id: `${key}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: normalizedName,
          displayName: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          category: categorizeIngredient(normalizedName),
          fromRecipes: [recipe.title],
          checked: false,
          haveAtHome: false,
        });
      }
    }
  }

  return Array.from(itemMap.values()).sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.name.localeCompare(b.name);
  });
}

export function groupByCategory(items: GroceryItem[]) {
  const groups: Record<GroceryCategory, GroceryItem[]> = {
    produce: [],
    dairy: [],
    meat: [],
    bakery: [],
    frozen: [],
    pantry: [],
    spices: [],
    beverages: [],
    other: [],
  };

  for (const item of items) {
    groups[item.category].push(item);
  }

  return Object.entries(groups)
    .filter(([_, items]) => items.length > 0)
    .map(([category, items]) => ({
      category: category as GroceryCategory,
      items,
    }));
}
