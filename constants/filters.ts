export const TIME_OPTIONS = [
  { label: "Any time", value: null },
  { label: "Under 15 min", value: 15 },
  { label: "Under 30 min", value: 30 },
  { label: "Under 1 hour", value: 60 },
] as const;

export const CUISINE_OPTIONS = [
  "Italian",
  "Mexican",
  "Asian",
  "American",
  "Indian",
  "Mediterranean",
  "French",
  "Japanese",
] as const;

export const DIET_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten Free",
  "Dairy Free",
  "Keto",
  "Paleo",
] as const;
