import { create } from "zustand";

interface FilterStore {
  maxTime: number | null;
  cuisine: string | null;
  diet: string | null;
  setMaxTime: (time: number | null) => void;
  setCuisine: (cuisine: string | null) => void;
  setDiet: (diet: string | null) => void;
  clearFilters: () => void;
  hasFilters: () => boolean;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  maxTime: null,
  cuisine: null,
  diet: null,
  setMaxTime: (maxTime) => set({ maxTime }),
  setCuisine: (cuisine) => set({ cuisine }),
  setDiet: (diet) => set({ diet }),
  clearFilters: () => set({ maxTime: null, cuisine: null, diet: null }),
  hasFilters: () => !!(get().maxTime || get().cuisine || get().diet),
}));
