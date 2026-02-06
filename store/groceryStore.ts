import { create } from "zustand";
import { GroceryItem } from "@/types/grocery";

interface GroceryStore {
  selectedRecipeIds: string[];
  groceryList: GroceryItem[];
  toggleRecipe: (id: string) => void;
  selectAllRecipes: (ids: string[]) => void;
  clearSelection: () => void;
  setGroceryList: (items: GroceryItem[]) => void;
  toggleChecked: (id: string) => void;
  toggleHaveAtHome: (id: string) => void;
  clearGroceryList: () => void;
}

export const useGroceryStore = create<GroceryStore>((set) => ({
  selectedRecipeIds: [],
  groceryList: [],
  toggleRecipe: (id) =>
    set((state) => ({
      selectedRecipeIds: state.selectedRecipeIds.includes(id)
        ? state.selectedRecipeIds.filter((i) => i !== id)
        : [...state.selectedRecipeIds, id],
    })),
  selectAllRecipes: (ids) => set({ selectedRecipeIds: ids }),
  clearSelection: () => set({ selectedRecipeIds: [] }),
  setGroceryList: (items) => set({ groceryList: items }),
  toggleChecked: (id) =>
    set((state) => ({
      groceryList: state.groceryList.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    })),
  toggleHaveAtHome: (id) =>
    set((state) => ({
      groceryList: state.groceryList.map((item) =>
        item.id === id ? { ...item, haveAtHome: !item.haveAtHome } : item
      ),
    })),
  clearGroceryList: () => set({ groceryList: [], selectedRecipeIds: [] }),
}));
