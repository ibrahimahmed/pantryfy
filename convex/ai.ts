import { action } from "./_generated/server";
import { v } from "convex/values";

export const getSmartSuggestion = action({
  args: { ingredients: v.array(v.string()) },
  handler: async (_ctx, args) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        dish: "Stir Fry",
        reason: `A quick stir fry is perfect with ${args.ingredients.slice(0, 3).join(", ")}`,
        tip: "Cook on high heat and keep ingredients moving for the best texture",
      };
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `I have these ingredients: ${args.ingredients.join(", ")}.
          
          Suggest ONE creative, practical dish I can make. Be specific.
          
          Return JSON only:
          {
            "dish": "name of the dish",
            "reason": "why this works with these ingredients (1 sentence)",
            "tip": "one pro tip to make it delicious"
          }`,
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content || "{}");
  },
});
