import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useUIStore, type PageKey } from "../../store/ui";

const PAGE_TITLES: Record<PageKey, string> = {
  dashboard: "Dashboard",
  transactions: "Transaksi",
  wallets: "Dompet & Utang",
  budgets: "Anggaran",
  reports: "Laporan",
  settings: "Pengaturan",
};

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function Header() {
  const activePage = useUIStore((s) => s.activePage);
  const period = useUIStore((s) => s.period);
  const setPeriod = useUIStore((s) => s.setPeriod);

  const shift = (delta: number) => {
    const d = new Date(period.year, period.month + delta, 1);
    setPeriod({ year: d.getFullYear(), month: d.getMonth() });
  };

  return (
    <header className="flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4">
      <h2 className="text-xl font-semibold text-gray-900">
        {PAGE_TITLES[activePage]}
      </h2>

      <div className="flex items-center gap-1">
        <button
          onClick={() => shift(-1)}
          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Bulan sebelumnya"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="min-w-[10rem] text-center text-sm font-medium text-gray-700">
          {MONTHS[period.month]} {period.year}
        </span>
        <button
          onClick={() => shift(1)}
          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Bulan berikutnya"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Cari… (Ctrl+F)"
          className="w-64 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
        />
      </div>
    </header>
  );
}
