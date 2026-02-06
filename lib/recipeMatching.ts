import { RecipeMatch } from "@/types/recipe";

export function calculateMatchScore(recipe: RecipeMatch): number {
  const total = recipe.usedIngredientCount + recipe.missedIngredientCount;
  return total > 0 ? recipe.usedIngredientCount / total : 0;
}

export function categorizeRecipes(recipes: RecipeMatch[]) {
  const canMakeNow = recipes.filter((r) => r.missedIngredientCount === 0);
  const almostThere = recipes.filter(
    (r) => r.missedIngredientCount > 0 && r.missedIngredientCount <= 2
  );
  const needMore = recipes.filter((r) => r.missedIngredientCount > 2);

  return {
    canMakeNow: sortByScore(canMakeNow),
    almostThere: sortByScore(almostThere),
    needMore: sortByScore(needMore),
  };
}

function sortByScore(recipes: RecipeMatch[]): RecipeMatch[] {
  return [...recipes].sort(
    (a, b) => calculateMatchScore(b) - calculateMatchScore(a)
  );
}
