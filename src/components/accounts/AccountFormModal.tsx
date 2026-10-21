import { useEffect, useState, type FormEvent } from "react";
import Modal from "../ui/Modal";
import { useAccountsStore } from "../../store/accounts";
import {
  ACCOUNT_TYPE_ICONS,
  ACCOUNT_TYPE_LABELS,
  ACCOUNT_TYPE_ORDER,
  PRESET_COLORS,
} from "../../lib/meta";
import type { Account, AccountType } from "../../types";
import { AppIcon } from "../Icon";

interface AccountFormModalProps {
  open: boolean;
  account: Account | null; // null = tambah baru
  onClose: () => void;
}

export default function AccountFormModal({
  open,
  account,
  onClose,
}: AccountFormModalProps) {
  const create = useAccountsStore((s) => s.create);
  const update = useAccountsStore((s) => s.update);

  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("cash");
  const [initialBalance, setInitialBalance] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (account) {
      setName(account.name);
      setType(account.type);
      setInitialBalance(String(account.initial_balance));
      setColor(account.color);
    } else {
      setName("");
      setType("cash");
      setInitialBalance("");
      setColor(PRESET_COLORS[0]);
    }
  }, [open, account]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Nama akun wajib diisi.");
      return;
    }

    const balance =
      parseFloat(initialBalance.replace(/[^\d.-]/g, "")) || 0;

    setSaving(true);
    setError(null);
    try {
      const input = {
        name: trimmed,
        type,
        initial_balance: balance,
        color,
        icon: ACCOUNT_TYPE_ICONS[type],
      };
      if (account) {
        await update(account.id, input);
      } else {
        await create(input);
      }
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={account ? "Ubah Akun" : "Tambah Akun"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nama Akun
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="mis. Gopay, BCA, Dompet Utama"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Tipe
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ACCOUNT_TYPE_ORDER.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  type === t
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <AppIcon name={ACCOUNT_TYPE_ICONS[t]} size={16} />
                {ACCOUNT_TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        {!account && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Saldo Awal
            </label>
            <input
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              inputMode="numeric"
              placeholder="0"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Warna
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-7 w-7 rounded-full ${
                  color === c ? "ring-2 ring-gray-400 ring-offset-2" : ""
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Warna ${c}`}
              />
            ))}
          </div>
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
            {saving ? "Menyimpan…" : "Simpan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
