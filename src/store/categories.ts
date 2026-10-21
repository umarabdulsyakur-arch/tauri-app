import { create } from "zustand";
import type { Category } from "../types";
import { listCategories } from "../db/categories";

interface CategoriesState {
  categories: Category[];
  loaded: boolean;
  load: () => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  loaded: false,
  load: async () => {
    const categories = await listCategories();
    set({ categories, loaded: true });
  },
}));
