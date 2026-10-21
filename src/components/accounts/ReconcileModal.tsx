import { useEffect, useState, type FormEvent } from "react";
import Modal from "../ui/Modal";
import { useAccountsStore } from "../../store/accounts";
import { formatRupiah } from "../../lib/format";
import type { Account } from "../../types";

interface ReconcileModalProps {
  account: Account | null;
  onClose: () => void;
}

export default function ReconcileModal({
  account,
  onClose,
}: ReconcileModalProps) {
  const reconcile = useAccountsStore((s) => s.reconcile);

  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (account) {
      setValue(String(account.current_balance));
      setNote("");
      setError(null);
    }
  }, [account]);

  if (!account) return null;

  const actual = parseFloat(value.replace(/[^\d.-]/g, ""));
  const difference = Number.isNaN(actual)
    ? 0
    : Math.round((actual - account.current_balance) * 100) / 100;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (Number.isNaN(actual)) {
      setError("Masukkan nominal saldo yang valid.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await reconcile(account.id, actual, note.trim() || "Penyesuaian saldo");
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={!!account} title="Sesuaikan Saldo" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm">
          <p className="text-gray-500">Saldo tercatat saat ini</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatRupiah(account.current_balance)}
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Saldo sebenarnya di {account.name}
          </label>
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputMode="numeric"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {!Number.isNaN(actual) && difference !== 0 && (
          <p
            className={`text-sm font-medium ${
              difference > 0 ? "text-income" : "text-expense"
            }`}
          >
            Selisih: {difference > 0 ? "+" : ""}
            {formatRupiah(difference)}
          </p>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Catatan (opsional)
          </label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="mis. Saldo setelah cek ATM"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
          >
            {saving ? "Menyimpan…" : "Simpan Penyesuaian"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
