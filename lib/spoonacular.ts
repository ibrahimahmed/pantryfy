const API_KEY = process.env.EXPO_PUBLIC_SPOONACULAR_KEY;
const BASE_URL = "https://api.spoonacular.com";

export async function findRecipesByIngredients(
  ingredients: string[],
  options?: { maxTime?: number; cuisine?: string; diet?: string }
) {
  const params = new URLSearchParams({
    ingredients: ingredients.join(","),
    number: "12",
    ranking: "2",
    apiKey: API_KEY!,
  });

  if (options?.maxTime) params.append("maxReadyTime", String(options.maxTime));
  if (options?.cuisine) params.append("cuisine", options.cuisine);
  if (options?.diet) params.append("diet", options.diet);

  const response = await fetch(
    `${BASE_URL}/recipes/findByIngredients?${params}`
  );
  if (!response.ok) throw new Error("API error");
  return response.json();
}

export async function getRecipeDetails(id: number) {
  const params = new URLSearchParams({
    includeNutrition: "true",
    apiKey: API_KEY!,
  });

  const response = await fetch(
    `${BASE_URL}/recipes/${id}/information?${params}`
  );
  if (!response.ok) throw new Error("API error");
  return response.json();
}

export async function searchRecipes(query: string) {
  const params = new URLSearchParams({
    query,
    number: "12",
    apiKey: API_KEY!,
  });

  const response = await fetch(`${BASE_URL}/recipes/complexSearch?${params}`);
  if (!response.ok) throw new Error("API error");
  return response.json();
}
