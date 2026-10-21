import { create } from "zustand";
import type { Account } from "../types";
import * as repo from "../db/accounts";
import type { AccountInput } from "../db/accounts";

interface AccountsState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  create: (input: AccountInput) => Promise<void>;
  update: (id: number, input: AccountInput) => Promise<void>;
  setArchived: (id: number, archived: boolean) => Promise<void>;
  reconcile: (id: number, actualBalance: number, note: string) => Promise<void>;
}

export const useAccountsStore = create<AccountsState>((set) => ({
  accounts: [],
  loading: false,
  error: null,

  load: async () => {
    set({ loading: true, error: null });
    try {
      const accounts = await repo.listAccounts();
      set({ accounts, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  create: async (input) => {
    await repo.createAccount(input);
    set({ accounts: await repo.listAccounts() });
  },

  update: async (id, input) => {
    await repo.updateAccount(id, input);
    set({ accounts: await repo.listAccounts() });
  },

  setArchived: async (id, archived) => {
    await repo.setAccountArchived(id, archived);
    set({ accounts: await repo.listAccounts() });
  },

  reconcile: async (id, actualBalance, note) => {
    await repo.reconcileAccount(id, actualBalance, note);
    set({ accounts: await repo.listAccounts() });
  },
}));
