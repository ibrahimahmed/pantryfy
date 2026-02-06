import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),

  savedRecipes: defineTable({
    userId: v.optional(v.string()),
    title: v.string(),
    source: v.union(
      v.literal("url"),
      v.literal("manual"),
      v.literal("spoonacular")
    ),
    sourceUrl: v.optional(v.string()),
    spoonacularId: v.optional(v.number()),
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
  }).index("by_user", ["userId"]),

  pantryItems: defineTable({
    userId: v.optional(v.string()),
    name: v.string(),
    category: v.string(),
  }).index("by_user", ["userId"]),

  mealPlans: defineTable({
    userId: v.optional(v.string()),
    date: v.string(),
    mealType: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner")
    ),
    recipeId: v.id("savedRecipes"),
  }).index("by_user_date", ["userId", "date"]),
});
