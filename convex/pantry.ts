import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getPantryItems = query({
  handler: async (ctx) => {
    return await ctx.db.query("pantryItems").collect();
  },
});

export const addPantryItem = mutation({
  args: { name: v.string(), category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("pantryItems", {
      userId: "default_user",
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
