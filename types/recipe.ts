export interface RecipeMatch {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  usedIngredients: IngredientMatch[];
  missedIngredients: IngredientMatch[];
  likes: number;
}

export interface IngredientMatch {
  id: number;
  name: string;
  amount: number;
  unit: string;
  image: string;
}

export interface RecipeDetail {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  instructions: string;
  analyzedInstructions: AnalyzedInstruction[];
  extendedIngredients: ExtendedIngredient[];
  nutrition?: { nutrients: Nutrient[] };
  cuisines: string[];
  diets: string[];
  sourceUrl?: string;
}

export interface ExtendedIngredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  original: string;
}

export interface AnalyzedInstruction {
  name: string;
  steps: InstructionStep[];
}

export interface InstructionStep {
  number: number;
  step: string;
}

export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
}

export interface SavedRecipe {
  _id: string;
  title: string;
  source: "url" | "manual" | "spoonacular";
  sourceUrl?: string;
  spoonacularId?: number;
  imageUrl?: string;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
    raw: string;
  }[];
  servings: number;
}
