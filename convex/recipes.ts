import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

async function getUserId(ctx: any): Promise<string> {
  const userId = await auth.getUserId(ctx);
  return userId ?? "anonymous";
}

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
    const userId = await getUserId(ctx);
    return await ctx.db.insert("savedRecipes", {
      title: args.title,
      source: args.source,
      spoonacularId: args.spoonacularId ?? undefined,
      sourceUrl: args.sourceUrl ?? undefined,
      imageUrl: args.imageUrl ?? undefined,
      ingredients: args.ingredients,
      servings: args.servings,
      userId,
    });
  },
});

export const getSavedRecipes = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    return await ctx.db
      .query("savedRecipes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
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
    const userId = await getUserId(ctx);
    const recipes = await ctx.db
      .query("savedRecipes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return recipes.some((r) => r.spoonacularId === args.spoonacularId);
  },
});
