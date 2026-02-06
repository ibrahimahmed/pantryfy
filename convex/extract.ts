import { action } from "./_generated/server";
import { v } from "convex/values";

export const extractRecipeFromUrl = action({
  args: { url: v.string() },
  handler: async (_ctx, args) => {
    const spoonacularKey = process.env.SPOONACULAR_API_KEY;

    // Try Spoonacular first
    if (spoonacularKey) {
      try {
        const spoonResponse = await fetch(
          `https://api.spoonacular.com/recipes/extract?url=${encodeURIComponent(args.url)}&apiKey=${spoonacularKey}`
        );

        if (spoonResponse.ok) {
          const data = await spoonResponse.json();
          if (data.title && data.extendedIngredients) {
            return {
              success: true,
              source: "spoonacular" as const,
              title: data.title,
              imageUrl: data.image,
              servings: data.servings || 4,
              ingredients: data.extendedIngredients.map((i: any) => ({
                name: i.name,
                quantity: i.amount,
                unit: i.unit,
                raw: i.original,
              })),
            };
          }
        }
      } catch (e) {
        console.log("Spoonacular extraction failed, trying OpenAI");
      }
    }

    // Fallback to OpenAI
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${openaiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "user",
                  content: `Extract recipe from this URL: ${args.url}
              
              Return JSON:
              {
                "title": "recipe name",
                "servings": 4,
                "ingredients": [
                  {"name": "flour", "quantity": 2, "unit": "cups", "raw": "2 cups flour"}
                ]
              }`,
                },
              ],
              response_format: { type: "json_object" },
            }),
          }
        );

        const data = await response.json();
        const parsed = JSON.parse(data.choices[0].message.content || "{}");
        return { success: true, source: "ai" as const, ...parsed };
      } catch (e) {
        return {
          success: false,
          error: "Could not extract recipe from URL",
        } as const;
      }
    }

    return {
      success: false,
      error: "No extraction service available. Add API keys in Convex dashboard.",
    } as const;
  },
});
