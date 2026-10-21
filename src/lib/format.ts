/**
 * Memformat angka menjadi rupiah tanpa desimal, contoh: 50000 -> "Rp 50.000".
 * Angka negatif diberi awalan "-".
 */
export function formatRupiah(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  const absolute = Math.abs(amount);
  return `${sign}Rp ${new Intl.NumberFormat("id-ID").format(absolute)}`;
}

/**
 * Mengubah string tanggal "YYYY-MM-DD" menjadi "DD/MM/YYYY" untuk tampilan.
 */
export function formatDateIndonesian(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}
