export type GroceryCategory =
  | "produce"
  | "dairy"
  | "meat"
  | "bakery"
  | "frozen"
  | "pantry"
  | "spices"
  | "beverages"
  | "other";

export interface GroceryItem {
  id: string;
  name: string;
  displayName: string;
  quantity: number;
  unit: string;
  category: GroceryCategory;
  fromRecipes: string[];
  checked: boolean;
  haveAtHome: boolean;
}
