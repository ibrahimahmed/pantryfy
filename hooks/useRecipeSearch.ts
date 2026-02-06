import { useState, useCallback } from "react";
import { findRecipesByIngredients } from "@/lib/spoonacular";
import { categorizeRecipes } from "@/lib/recipeMatching";
import { RecipeMatch } from "@/types/recipe";

interface SearchFilters {
  maxTime?: number;
  cuisine?: string;
  diet?: string;
}

export function useRecipeSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    canMakeNow: RecipeMatch[];
    almostThere: RecipeMatch[];
    needMore: RecipeMatch[];
  } | null>(null);

  const search = useCallback(
    async (ingredients: string[], filters?: SearchFilters) => {
      setLoading(true);
      setError(null);
      try {
        const recipes = await findRecipesByIngredients(ingredients, {
          maxTime: filters?.maxTime ?? undefined,
          cuisine: filters?.cuisine ?? undefined,
          diet: filters?.diet ?? undefined,
        });
        setResults(categorizeRecipes(recipes));
      } catch (e) {
        setError("Failed to fetch recipes. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return { search, loading, error, results, reset };
}
