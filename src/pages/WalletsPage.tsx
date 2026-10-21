import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useAccountsStore } from "../store/accounts";
import { formatRupiah } from "../lib/format";
import {
  ACCOUNT_TYPE_LABELS,
  ACCOUNT_TYPE_ORDER,
} from "../lib/meta";
import { AppIcon } from "../components/Icon";
import AccountFormModal from "../components/accounts/AccountFormModal";
import ReconcileModal from "../components/accounts/ReconcileModal";
import type { Account, AccountType } from "../types";

export default function WalletsPage() {
  const accounts = useAccountsStore((s) => s.accounts);
  const setArchived = useAccountsStore((s) => s.setArchived);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [reconciling, setReconciling] = useState<Account | null>(null);

  const active = accounts.filter((a) => !a.is_archived);
  const archived = accounts.filter((a) => !!a.is_archived);

  const total = useMemo(
    () => active.reduce((sum, a) => sum + a.current_balance, 0),
    [active],
  );

  const grouped = useMemo(() => {
    const map = new Map<AccountType, Account[]>();
    for (const type of ACCOUNT_TYPE_ORDER) map.set(type, []);
    for (const account of active) map.get(account.type)?.push(account);
    return map;
  }, [active]);

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (account: Account) => {
    setEditing(account);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-gray-500">Total saldo keseluruhan</p>
          <p className="text-3xl font-bold text-gray-900">{formatRupiah(total)}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
        >
          <Plus size={16} />
          Tambah Akun
        </button>
      </div>

      {ACCOUNT_TYPE_ORDER.map((type) => {
        const list = grouped.get(type) ?? [];
        const typeTotal = list.reduce((sum, a) => sum + a.current_balance, 0);
        return (
          <section key={type}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                {ACCOUNT_TYPE_LABELS[type]}
              </h3>
              <span className="text-sm text-gray-500">
                {formatRupiah(typeTotal)}
              </span>
            </div>

            {list.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-400">
                Belum ada akun {ACCOUNT_TYPE_LABELS[type]}.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    onEdit={() => openEdit(account)}
                    onReconcile={() => setReconciling(account)}
                    onArchive={() => setArchived(account.id, true)}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}

      {archived.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Diarsipkan
          </h3>
          <ul className="space-y-1">
            {archived.map((account) => (
              <li
                key={account.id}
                className="flex items-center justify-between rounded-lg bg-white px-4 py-2 text-sm text-gray-500"
              >
                <span className="flex items-center gap-2">
                  <AppIcon name={account.icon} size={16} />
                  {account.name}
                </span>
                <button
                  onClick={() => setArchived(account.id, false)}
                  className="font-medium text-emerald-600 hover:underline"
                >
                  Pulihkan
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <AccountFormModal
        open={showForm}
        account={editing}
        onClose={() => setShowForm(false)}
      />
      <ReconcileModal
        account={reconciling}
        onClose={() => setReconciling(null)}
      />
    </div>
  );
}

interface AccountCardProps {
  account: Account;
  onEdit: () => void;
  onReconcile: () => void;
  onArchive: () => void;
}

function AccountCard({
  account,
  onEdit,
  onReconcile,
  onArchive,
}: AccountCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
          style={{ backgroundColor: account.color }}
        >
          <AppIcon name={account.icon} size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">
            {account.name}
          </p>
          <p className="text-xs text-gray-400">
            {ACCOUNT_TYPE_LABELS[account.type]}
          </p>
        </div>
      </div>

      <p className="mt-3 text-xl font-bold text-gray-900">
        {formatRupiah(account.current_balance)}
      </p>

      <div className="mt-3 flex gap-2">
        <button
          onClick={onReconcile}
          className="flex-1 rounded-md border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          Sesuaikan Saldo
        </button>
        <button
          onClick={onEdit}
          className="rounded-md border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          Edit
        </button>
        <button
          onClick={onArchive}
          className="rounded-md border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-400 hover:bg-gray-50"
        >
          Arsip
        </button>
      </div>
    </div>
  );
}
