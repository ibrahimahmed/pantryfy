import { create } from "zustand";
import { SelectedIngredient } from "@/types";

interface IngredientStore {
  selected: SelectedIngredient[];
  addIngredient: (ing: SelectedIngredient) => void;
  removeIngredient: (id: string) => void;
  clearAll: () => void;
}

export const useIngredientStore = create<IngredientStore>((set) => ({
  selected: [],
  addIngredient: (ing) =>
    set((state) => {
      if (state.selected.some((s) => s.id === ing.id)) return state;
      return { selected: [...state.selected, ing] };
    }),
  removeIngredient: (id) =>
    set((state) => ({
      selected: state.selected.filter((i) => i.id !== id),
    })),
  clearAll: () => set({ selected: [] }),
}));
