import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

async function getUserId(ctx: any): Promise<string> {
  const userId = await auth.getUserId(ctx);
  return userId ?? "anonymous";
}

export const getMealPlan = query({
  args: { startDate: v.string(), endDate: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const plans = await ctx.db
      .query("mealPlans")
      .withIndex("by_user_date", (q) => q.eq("userId", userId))
      .collect();
    return plans.filter(
      (p) => p.date >= args.startDate && p.date <= args.endDate
    );
  },
});

export const setMealPlan = mutation({
  args: {
    date: v.string(),
    mealType: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner")
    ),
    recipeId: v.id("savedRecipes"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const existing = await ctx.db
      .query("mealPlans")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", userId).eq("date", args.date)
      )
      .collect();
    const match = existing.find((p) => p.mealType === args.mealType);

    if (match) {
      await ctx.db.patch(match._id, { recipeId: args.recipeId });
    } else {
      await ctx.db.insert("mealPlans", {
        userId,
        date: args.date,
        mealType: args.mealType,
        recipeId: args.recipeId,
      });
    }
  },
});

export const removeMealPlan = mutation({
  args: { id: v.id("mealPlans") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
