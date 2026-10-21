import { useEffect, useState } from "react";
import { initDatabase } from "./db/database";
import { useAccountsStore } from "./store/accounts";
import AppShell from "./components/layout/AppShell";

function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadAccounts = useAccountsStore((s) => s.load);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await initDatabase();
        await loadAccounts();
        if (!cancelled) setReady(true);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadAccounts]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-600">Gagal memuat aplikasi</p>
          <p className="mt-1 text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-gray-500">
        Memuat data…
      </div>
    );
  }

  return <AppShell />;
}

export default App;
