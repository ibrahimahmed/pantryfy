import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

async function getUserId(ctx: any): Promise<string> {
  const userId = await auth.getUserId(ctx);
  return userId ?? "anonymous";
}

export const getPantryItems = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    return await ctx.db
      .query("pantryItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const addPantryItem = mutation({
  args: { name: v.string(), category: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    return await ctx.db.insert("pantryItems", {
      userId,
      name: args.name,
      category: args.category,
    });
  },
});

export const removePantryItem = mutation({
  args: { id: v.id("pantryItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
