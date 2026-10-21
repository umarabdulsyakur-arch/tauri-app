import { create } from "zustand";
import * as repo from "../db/transactions";
import type { TransactionFilters, TransactionInput, TransactionRow, TransferInput } from "../db/transactions";
import { useAccountsStore } from "./accounts";

interface TransactionsState {
  transactions: TransactionRow[];
  loading: boolean;
  lastFilters: TransactionFilters;
  load: (filters?: TransactionFilters) => Promise<void>;
  create: (input: TransactionInput) => Promise<void>;
  update: (id: number, input: TransactionInput) => Promise<void>;
  remove: (id: number) => Promise<void>;
  transfer: (input: TransferInput) => Promise<void>;
}

export const useTransactionsStore = create<TransactionsState>((set, get) => ({
  transactions: [],
  loading: false,
  lastFilters: {},

  load: async (filters) => {
    const nextFilters = filters ?? get().lastFilters;
    set({ loading: true, lastFilters: nextFilters });
    try {
      const transactions = await repo.listTransactions(nextFilters);
      set({ transactions, loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  create: async (input) => {
    await repo.createTransaction(input);
    await useAccountsStore.getState().load();
    await get().load();
  },

  update: async (id, input) => {
    await repo.updateTransaction(id, input);
    await useAccountsStore.getState().load();
    await get().load();
  },

  remove: async (id) => {
    await repo.deleteTransaction(id);
    await useAccountsStore.getState().load();
    await get().load();
  },

  transfer: async (input) => {
    await repo.createTransfer(input);
    await useAccountsStore.getState().load();
    await get().load();
  },
}));
