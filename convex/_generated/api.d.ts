/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { ApiFromModules } from "convex/server";
import type * as ai from "../ai.js";
import type * as extract from "../extract.js";
import type * as pantry from "../pantry.js";
import type * as planner from "../planner.js";
import type * as recipes from "../recipes.js";

/**
 * A utility for referencing Convex functions in your app's API.
 */
declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  extract: typeof extract;
  pantry: typeof pantry;
  planner: typeof planner;
  recipes: typeof recipes;
}>;
export declare const api: typeof fullApi;
export declare const internal: any;
