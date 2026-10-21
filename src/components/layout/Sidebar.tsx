import {
  ArrowLeftRight,
  BarChart3,
  LayoutDashboard,
  Plus,
  Settings,
  Target,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useUIStore, type PageKey } from "../../store/ui";

interface MenuItem {
  key: PageKey;
  label: string;
  icon: LucideIcon;
}

const MENU: MenuItem[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "transactions", label: "Transaksi", icon: ArrowLeftRight },
  { key: "wallets", label: "Dompet & Utang", icon: Wallet },
  { key: "budgets", label: "Anggaran", icon: Target },
  { key: "reports", label: "Laporan", icon: BarChart3 },
  { key: "settings", label: "Pengaturan", icon: Settings },
];

export default function Sidebar() {
  const activePage = useUIStore((s) => s.activePage);
  const setActivePage = useUIStore((s) => s.setActivePage);

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="px-4 py-5">
        <h1 className="text-lg font-bold text-gray-900">Keuangan Pribadi</h1>
        <p className="text-xs text-gray-400">Offline · Pribadi</p>
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={() => setActivePage("transactions")}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-income px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
        >
          <Plus size={16} />
          Transaksi Baru
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {MENU.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActivePage(item.key)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-4 text-xs text-gray-300">v0.1.0</div>
    </aside>
  );
}
