import { create } from "zustand";

export type PageKey =
  | "dashboard"
  | "transactions"
  | "wallets"
  | "budgets"
  | "reports"
  | "settings";

export interface Period {
  year: number;
  month: number; // 0 = Januari
}

function currentPeriod(): Period {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
}

interface UIState {
  activePage: PageKey;
  setActivePage: (page: PageKey) => void;
  period: Period;
  setPeriod: (period: Period) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  quickEntryOpen: boolean;
  setQuickEntryOpen: (open: boolean) => void;
  transferOpen: boolean;
  setTransferOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activePage: "dashboard",
  setActivePage: (page) => set({ activePage: page }),
  period: currentPeriod(),
  setPeriod: (period) => set({ period }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  quickEntryOpen: false,
  setQuickEntryOpen: (open) => set({ quickEntryOpen: open }),
  transferOpen: false,
  setTransferOpen: (open) => set({ transferOpen: open }),
}));
