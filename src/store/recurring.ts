import { create } from "zustand";
import * as repo from "../db/recurring";
import type { RecurringInput } from "../db/recurring";
import type { RecurringRule } from "../types";

interface RecurringState {
  rules: RecurringRule[];
  load: () => Promise<void>;
  create: (input: RecurringInput) => Promise<void>;
  update: (id: number, input: RecurringInput) => Promise<void>;
  setActive: (id: number, active: boolean) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const useRecurringStore = create<RecurringState>((set, get) => ({
  rules: [],

  load: async () => {
    set({ rules: await repo.listRecurringRules() });
  },

  create: async (input) => {
    await repo.createRecurring(input);
    await get().load();
  },

  update: async (id, input) => {
    await repo.updateRecurring(id, input);
    await get().load();
  },

  setActive: async (id, active) => {
    await repo.setRecurringActive(id, active);
    await get().load();
  },

  remove: async (id) => {
    await repo.deleteRecurring(id);
    await get().load();
  },
}));
