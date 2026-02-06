export interface ParsedIngredient {
  name: string;
  quantity: number;
  unit: string;
  raw: string;
}

export function parseIngredientLine(line: string): ParsedIngredient {
  const trimmed = line.trim();
  if (!trimmed) {
    return { quantity: 0, unit: "", name: "", raw: "" };
  }

  const match = trimmed.match(
    /^([\d\s\/\.]+)?\s*(cups?|tbsp|tablespoons?|tsp|teaspoons?|oz|ounces?|lbs?|pounds?|g|grams?|kg|kilograms?|ml|liters?|litres?|large|medium|small|bunch|cloves?|slices?|pieces?|cans?)\s+(.+)$/i
  );

  if (match) {
    return {
      quantity: parseFraction(match[1]?.trim() || "1"),
      unit: normalizeUnit(match[2]),
      name: match[3].trim().toLowerCase(),
      raw: trimmed,
    };
  }

  // Try number + name pattern: "3 eggs"
  const simpleMatch = trimmed.match(/^([\d\s\/\.]+)\s+(.+)$/);
  if (simpleMatch) {
    return {
      quantity: parseFraction(simpleMatch[1].trim()),
      unit: "",
      name: simpleMatch[2].trim().toLowerCase(),
      raw: trimmed,
    };
  }

  return { quantity: 1, unit: "", name: trimmed.toLowerCase(), raw: trimmed };
}

function parseFraction(str: string): number {
  if (!str) return 1;
  const trimmed = str.trim();
  if (trimmed.includes(" ")) {
    const parts = trimmed.split(" ");
    const whole = parseInt(parts[0]);
    const frac = parseFraction(parts.slice(1).join(" "));
    return whole + frac;
  }
  if (trimmed.includes("/")) {
    const [num, denom] = trimmed.split("/");
    const d = parseInt(denom);
    return d !== 0 ? parseInt(num) / d : 1;
  }
  return parseFloat(trimmed) || 1;
}

function normalizeUnit(unit: string): string {
  const normalized: Record<string, string> = {
    tablespoon: "tbsp",
    tablespoons: "tbsp",
    teaspoon: "tsp",
    teaspoons: "tsp",
    ounce: "oz",
    ounces: "oz",
    pound: "lb",
    pounds: "lb",
    lbs: "lb",
    gram: "g",
    grams: "g",
    kilogram: "kg",
    kilograms: "kg",
    liter: "L",
    litre: "L",
    liters: "L",
    litres: "L",
    cups: "cup",
    slices: "slice",
    pieces: "piece",
    cloves: "clove",
    cans: "can",
  };
  const lower = unit.toLowerCase();
  return normalized[lower] || lower;
}
