import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type CookingGoal =
  | "eat_healthier"
  | "save_money"
  | "improve_skills"
  | "organize_recipes"
  | "plan_meals"
  | "try_cuisines";

export type DietType =
  | "vegetarian"
  | "high_protein"
  | "low_carb"
  | "no_specific";

export type RecipeSource =
  | "instagram"
  | "tiktok"
  | "facebook"
  | "pinterest"
  | "cookbooks"
  | "websites";

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  goals: CookingGoal[];
  cookingFrequency: number | null;
  diet: DietType | null;
  recipeSources: RecipeSource[];

  // Actions
  setGoals: (goals: CookingGoal[]) => void;
  toggleGoal: (goal: CookingGoal) => void;
  setCookingFrequency: (freq: number) => void;
  setDiet: (diet: DietType) => void;
  setRecipeSources: (sources: RecipeSource[]) => void;
  toggleRecipeSource: (source: RecipeSource) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      hasCompletedOnboarding: false,
      goals: [],
      cookingFrequency: null,
      diet: null,
      recipeSources: [],

      setGoals: (goals) => set({ goals }),
      toggleGoal: (goal) => {
        const current = get().goals;
        if (current.includes(goal)) {
          set({ goals: current.filter((g) => g !== goal) });
        } else {
          set({ goals: [...current, goal] });
        }
      },
      setCookingFrequency: (cookingFrequency) => set({ cookingFrequency }),
      setDiet: (diet) => set({ diet }),
      setRecipeSources: (recipeSources) => set({ recipeSources }),
      toggleRecipeSource: (source) => {
        const current = get().recipeSources;
        if (current.includes(source)) {
          set({ recipeSources: current.filter((s) => s !== source) });
        } else {
          set({ recipeSources: [...current, source] });
        }
      },
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetOnboarding: () =>
        set({
          hasCompletedOnboarding: false,
          goals: [],
          cookingFrequency: null,
          diet: null,
          recipeSources: [],
        }),
    }),
    {
      name: "pantryfy-onboarding",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
