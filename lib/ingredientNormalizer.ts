const ALIASES: Record<string, string> = {
  aubergine: "eggplant",
  capsicum: "bell pepper",
  coriander: "cilantro",
  rocket: "arugula",
  courgette: "zucchini",
  prawns: "shrimp",
  mince: "ground beef",
  catsup: "ketchup",
};

const PREFIXES_TO_REMOVE = [
  "fresh",
  "dried",
  "frozen",
  "chopped",
  "minced",
  "diced",
  "sliced",
  "grated",
  "shredded",
  "whole",
  "ground",
  "crushed",
  "peeled",
  "boneless",
  "skinless",
  "organic",
  "raw",
  "cooked",
];

export function normalizeIngredientName(name: string): string {
  let normalized = name.toLowerCase().trim();

  for (const prefix of PREFIXES_TO_REMOVE) {
    normalized = normalized.replace(new RegExp(`^${prefix}\\s+`), "");
  }

  // Remove parenthetical notes like "(optional)"
  normalized = normalized.replace(/\s*\(.*?\)\s*/g, "").trim();

  if (ALIASES[normalized]) {
    normalized = ALIASES[normalized];
  }

  // Simple depluralization
  if (
    normalized.endsWith("ies") &&
    !normalized.endsWith("series") &&
    normalized.length > 4
  ) {
    normalized = normalized.slice(0, -3) + "y";
  } else if (
    normalized.endsWith("es") &&
    !normalized.endsWith("cheese") &&
    !normalized.endsWith("rice") &&
    normalized.length > 4
  ) {
    normalized = normalized.slice(0, -2);
  } else if (
    normalized.endsWith("s") &&
    !normalized.endsWith("ss") &&
    !normalized.endsWith("us") &&
    normalized.length > 3
  ) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}
