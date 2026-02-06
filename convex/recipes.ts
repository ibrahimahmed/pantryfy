import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveRecipe = mutation({
  args: {
    title: v.string(),
    source: v.union(
      v.literal("url"),
      v.literal("manual"),
      v.literal("spoonacular")
    ),
    spoonacularId: v.optional(v.number()),
    sourceUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    ingredients: v.array(
      v.object({
        name: v.string(),
        quantity: v.number(),
        unit: v.string(),
        raw: v.string(),
      })
    ),
    servings: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("savedRecipes", {
      ...args,
      userId: "default_user",
    });
  },
});

export const getSavedRecipes = query({
  handler: async (ctx) => {
    return await ctx.db.query("savedRecipes").collect();
  },
});

export const getSavedRecipe = query({
  args: { id: v.id("savedRecipes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const deleteRecipe = mutation({
  args: { id: v.id("savedRecipes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const isRecipeSaved = query({
  args: { spoonacularId: v.number() },
  handler: async (ctx, args) => {
    const recipes = await ctx.db.query("savedRecipes").collect();
    return recipes.some((r) => r.spoonacularId === args.spoonacularId);
  },
});
