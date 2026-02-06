import { GroceryCategory } from "@/types/grocery";

export const GROCERY_CATEGORIES: Record<
  GroceryCategory,
  { label: string; emoji: string }
> = {
  produce: { label: "Produce", emoji: "\u{1F96C}" },
  dairy: { label: "Dairy", emoji: "\u{1F95B}" },
  meat: { label: "Meat & Fish", emoji: "\u{1F969}" },
  bakery: { label: "Bakery", emoji: "\u{1F35E}" },
  frozen: { label: "Frozen", emoji: "\u{1F9CA}" },
  pantry: { label: "Pantry", emoji: "\u{1F96B}" },
  spices: { label: "Spices", emoji: "\u{1F9C2}" },
  beverages: { label: "Beverages", emoji: "\u{1F9C3}" },
  other: { label: "Other", emoji: "\u{1F4E6}" },
};
