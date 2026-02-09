import { internalMutation } from "./_generated/server";

/**
 * One-time migration: fix userId fields that were stored as
 * "userId|sessionId" (from identity.subject) instead of just "userId"
 * (from auth.getUserId).
 *
 * Run via the Convex dashboard:
 *   npx convex run migrations:fixUserIds
 */
export const fixUserIds = internalMutation({
  handler: async (ctx) => {
    const tables = ["savedRecipes", "pantryItems", "mealPlans"] as const;
    let totalUpdated = 0;

    for (const table of tables) {
      const records = await ctx.db.query(table).collect();
      for (const record of records) {
        const oldUserId = (record as any).userId as string | undefined;
        if (oldUserId && oldUserId.includes("|")) {
          const [actualUserId] = oldUserId.split("|");
          await ctx.db.patch(record._id, { userId: actualUserId } as any);
          totalUpdated++;
        }
      }
    }

    console.log(
      `Migration complete: updated ${totalUpdated} records across savedRecipes, pantryItems, mealPlans`
    );
    return { updated: totalUpdated };
  },
});
