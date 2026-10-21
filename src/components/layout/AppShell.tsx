import { useEffect, type ComponentType } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useUIStore, type PageKey } from "../../store/ui";
import DashboardPage from "../../pages/DashboardPage";
import TransactionsPage from "../../pages/TransactionsPage";
import WalletsPage from "../../pages/WalletsPage";
import BudgetsPage from "../../pages/BudgetsPage";
import ReportsPage from "../../pages/ReportsPage";
import SettingsPage from "../../pages/SettingsPage";

const PAGES: Record<PageKey, ComponentType> = {
  dashboard: DashboardPage,
  transactions: TransactionsPage,
  wallets: WalletsPage,
  budgets: BudgetsPage,
  reports: ReportsPage,
  settings: SettingsPage,
};

const PAGE_ORDER: PageKey[] = [
  "dashboard",
  "transactions",
  "wallets",
  "budgets",
  "reports",
  "settings",
];

export default function AppShell() {
  const activePage = useUIStore((s) => s.activePage);
  const setActivePage = useUIStore((s) => s.setActivePage);

  // Pintasan navigasi cepat: Ctrl+1 .. Ctrl+6.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.ctrlKey || e.metaKey) return;
      const index = ["1", "2", "3", "4", "5", "6"].indexOf(e.key);
      if (index === -1) return;
      e.preventDefault();
      setActivePage(PAGE_ORDER[index]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setActivePage]);

  const Page = PAGES[activePage];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Page />
        </main>
      </div>
    </div>
  );
}
