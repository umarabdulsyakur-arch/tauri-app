# PROJECT SPECIFICATION: WINDOWS DESKTOP PERSONAL FINANCE APP

## 1. ROLE & OBJECTIVE
Kamu adalah Senior Desktop Software Engineer dan UI/UX Designer. Tugasmu adalah membangun aplikasi keuangan pribadi untuk desktop Windows yang ringan, 100% offline-first, dengan antarmuka minimalis, bersih, dan sangat mudah dipahami pengguna awam.

## 2. TECH STACK (RECOMMENDED FOR AI GENERATION)
- **Runtime Desktop:** Tauri v2 (Rust) atau Electron + Vite (pilih yang paling stabil untuk integrasi lokal).
- **Frontend:** React + TypeScript + Tailwind CSS + Lucide Icons.
- **UI Components:** Shadcn UI / Radix UI (fokus pada komponen bersih, kontras jelas, tanpa animasi berlebihan).
- **Database:** SQLite lokal (via `better-sqlite3` atau `tauri-plugin-sql`) disimpan di direktori `AppData/Roaming/[AppName]`.
- **State Management:** Zustand atau React Context.
- **Charts & Export:** Recharts (grafik minimalis), SheetJS/xlsx (import/export Excel & CSV), jsPDF (export laporan PDF).

---

## 3. UI/UX DESIGN PRINCIPLES (MINIMALIS & MUDAH DIPAHAMI)
1. **Layout Utama (3 Zona):**
   - **Sidebar Kiri (Sempit & Tetap):** Hanya 6 menu utama: *Dashboard, Transaksi, Dompet & Utang, Anggaran, Laporan, Pengaturan* + Tombol besar `+ Transaksi Baru (Ctrl+N)` di bagian atas.
   - **Header Atas:** Judul halaman aktif, pemilih periode bulan/tahun (contoh: `< Oktober 2026 >`), dan bar pencarian cepat (`Ctrl+F`).
   - **Area Konten Utama:** Maksimal 3 kartu ringkasan di bagian atas, diikuti tabel data yang bersih atau grafik di bagian bawah. Gunakan *whitespace* (ruang kosong) yang lega agar mata tidak lelah.
2. **Kode Warna Konsisten (Semantic Colors):**
   - Pemasukan: Hijau (`#10B981`)
   - Pengeluaran: Merah (`#EF4444`)
   - Transfer / Netral: Biru (`#3B82F6`)
   - Peringatan Anggaran (>80%): Kuning/Oranye (`#F59E0B`)
3. **Keyboard-First UX:**
   - Semua form harus bisa dioperasikan penuh tanpa mouse (`Tab` untuk pindah kolom, `Arrow Up/Down` untuk pilih dropdown, `Enter` untuk simpan, `Esc` untuk tutup modal).
   - Input nominal uang otomatis memformat titik ribuan saat diketik (contoh: ketik `50000` tampil `Rp 50.000`).

---

## 4. CORE FEATURES & FUNCTIONAL REQUIREMENTS

### Modul 1: Pencatatan & Transaksi
- **Quick Entry Modal (`Ctrl + N`):** Pop-up form cepat dari halaman mana saja. Fokus kursor langsung ke input **Nominal**.
- **Tipe Transaksi:**
  - *Pemasukan* (menambah saldo akun).
  - *Pengeluaran* (mengurangi saldo akun).
  - *Transfer* (mengurangi saldo Akun Asal, menambah saldo Akun Tujuan + opsi input biaya admin).
- **Kategori Bertingkat & Tag:** Kategori Utama (misal: Makanan) -> Subkategori (misal: Kopi/Jajan) + multi-tag opsional (misal: `#kantor`, `#liburan`).
- **Transaksi Berulang (Recurring):** Jadwal otomatis (Harian, Mingguan, Bulanan, Tahunan) untuk tagihan rutin. Saat aplikasi dibuka, cek jadwal yang jatuh tempo dan buat transaksinya secara otomatis atau minta konfirmasi 1-klik.
- **Lampiran Bukti:** Upload foto struk (`.jpg`, `.png`) atau `.pdf`. File disalin ke folder lokal `AppData/attachments/` dan hanya *path*-nya yang disimpan di database.

### Modul 2: Manajemen Akun (Dompet) & Utang/Piutang
- **Multi-Akun:** Kelompokkan berdasarkan tipe: *Tunai, Bank, E-Wallet, Kartu Kredit*. Tampilkan total saldo masing-masing dan total keseluruhan.
- **Rekonsiliasi Saldo (Penyesuaian):** Fitur "Sesuaikan Saldo" di mana pengguna cukup mengetik saldo asli di dompet/rekening saat ini, lalu sistem otomatis membuat transaksi *Penyesuaian Selisih* (positif/negatif).
- **Pelacakan Utang & Piutang:** Catat nama orang, nominal, tanggal pinjam, tanggal jatuh tempo, dan status (Belum Lunas / Dicicil / Lunas). Pembayaran cicilan otomatis memotong/menambah saldo dompet yang dipilih.

### Modul 3: Anggaran (Budgeting)
- **Kuota Bulanan:** Set batas pengeluaran per kategori utama setiap bulan.
- **Indikator Visual (Progress Bar):**
  - 0% - 79%: Hijau (Aman)
  - 80% - 99%: Kuning (Hampir Habis)
  - ≥ 100%: Merah menyala + badge peringatan *Overbudget*.

### Modul 4: Laporan, Dashboard & Filter
- **Dashboard Utama:**
  - 4 Kartu Ringkasan: *Total Kekayaan Bersih, Pemasukan Bulan Ini, Pengeluaran Bulan Ini, Sisa Cashflow*.
  - Grafik Lingkaran (Donut Chart): Porsi pengeluaran per kategori.
  - Grafik Batang (Bar Chart): Tren Pemasukan vs Pengeluaran 6 bulan terakhir.
  - Daftar 5 transaksi terakhir & peringatan utang yang mendekati jatuh tempo.
- **Filter Data Lanjutan:** Filter tabel transaksi berdasarkan rentang tanggal, akun/dompet, kategori, tipe transaksi, rentang nominal, dan kata kunci catatan.

### Modul 5: Fitur Desktop Windows & Pengaturan (Settings)
- **Import & Export:**
  - Import mutasi dari file `.csv` / `.xlsx` dengan fitur *Column Mapping* sederhana (cocokkan kolom Tanggal, Nominal, Keterangan, Kategori).
  - Export laporan sesuai filter aktif ke format `.xlsx` dan `.pdf` siap cetak.
- **Backup & Restore Lokal:**
  - Tombol *Backup Sekarang* (menyimpan salinan file `.sqlite` + zip folder lampiran ke lokasi pilihan user seperti Flashdisk atau folder Google Drive/OneDrive).
  - Tombol *Restore Data* dari file backup.
- **Menu Pengaturan (Settings) Wajib:**
  1. **Umum & Format:** Mata uang default (`IDR - Rp`), format tanggal (`DD/MM/YYYY`), hari pertama dalam minggu (`Senin`).
  2. **Tampilan:** Mode Tema (*Terang / Gelap / Ikuti Sistem Windows*) dan ukuran teks (*Normal / Besar*).
  3. **Keamanan & Privasi:** Toggle kunci aplikasi dengan PIN 6 digit saat aplikasi baru dibuka atau *idle* selama X menit.
  4. **Manajemen Kategori:** Tambah, ubah, hapus, dan atur ikon/warna kategori & subkategori.
  5. **Pemeliharaan Database:** Lokasi folder penyimpanan data saat ini, jadwal *Auto-Backup* saat aplikasi ditutup, tombol *Bersihkan Cache Lampiran*, dan tombol bahaya *Reset Seluruh Data* (wajib konfirmasi ketik "HAPUS").

---

## 5. DATABASE SCHEMA (SQLITE)
Gunakan skema relasional berikut dengan *Foreign Key* aktif (`PRAGMA foreign_keys = ON;`):
1. `accounts`: `id`, `name`, `type` (cash/bank/ewallet/credit), `initial_balance`, `current_balance`, `color`, `icon`, `is_archived`, `created_at`
2. `categories`: `id`, `parent_id` (nullable untuk subkategori), `name`, `type` (income/expense), `color`, `icon`
3. `transactions`: `id`, `date`, `type` (income/expense/transfer/adjustment), `amount`, `account_id`, `to_account_id` (nullable, khusus transfer), `category_id`, `tags` (JSON string), `note`, `attachment_path`, `created_at`
4. `recurring_rules`: `id`, `title`, `type`, `amount`, `account_id`, `category_id`, `frequency` (daily/weekly/monthly/yearly), `next_due_date`, `is_active`
5. `budgets`: `id`, `category_id`, `month_year` (format `YYYY-MM`), `limit_amount`
6. `debts`: `id`, `person_name`, `type` (payable/receivable), `total_amount`, `remaining_amount`, `due_date`, `note`, `status` (unpaid/partial/paid)
7. `settings`: `key` (PRIMARY KEY), `value`

---

## 6. GLOBAL KEYBOARD SHORTCUTS (COMMANDS)
Implementasikan *event listener* di level aplikasi untuk pintasan berikut:
- `Ctrl + N`: Buka modal tambah transaksi baru.
- `Ctrl + T`: Buka modal transfer antar-dompet.
- `Ctrl + F`: Fokus ke kolom pencarian transaksi.
- `Ctrl + B`: Backup cepat database ke folder default.
- `Ctrl + L`: Kunci layar aplikasi seketika (jika fitur PIN aktif).
- `Ctrl + 1` s/d `Ctrl + 6`: Pindah cepat antar-menu di Sidebar.
- `Esc`: Tutup modal/pop-up yang sedang terbuka.

---

## 7. AI CODING EXECUTION RULES (INSTRUKSI UNTUK AI)
Ikuti aturan ketat ini saat menulis kode:
1. **Atomic Database Transactions:** Setiap penambahan/pengubahan/penghapusan transaksi WAJIB dijalankan dalam satu *database transaction* (`BEGIN` ... `COMMIT`). Jika transaksi ditambahkan, `current_balance` pada tabel `accounts` harus langsung ter-update secara akurat.
2. **Zero Placeholder Policy:** Jangan menulis komentar seperti `// TODO: implement logic here` atau `// rest of code`. Tulis kode yang utuh dan berfungsi penuh untuk setiap file yang dibuat.
3. **Clean Error Handling:** Semua operasi file (import CSV, baca foto struk, backup database) harus dibungkus dengan `try/catch` dan menampilkan notifikasi *toast* yang ramah pengguna dalam Bahasa Indonesia jika gagal.
4. **Bahasa Antarmuka:** Seluruh teks UI, label tombol, pesan error, dan placeholder harus menggunakan **Bahasa Indonesia** yang natural dan singkat.
5. **Tahapan Pengerjaan (Step-by-Step):**
   Jangan tulis semua kode sekaligus dalam satu respons agar tidak terpotong. Kerjakan secara bertahap dan minta konfirmasiku di setiap akhir tahap:
   - **Tahap 1:** Inisialisasi struktur proyek, konfigurasi SQLite, skema tabel, dan data awal (*seed data* kategori umum Indonesia & pengaturan default).
   - **Tahap 2:** Layout utama (Sidebar minimalis, Header, Routing) + Modul Manajemen Akun/Dompet & Rekonsiliasi Saldo.
   - **Tahap 3:** Modul Transaksi (Quick Entry Modal `Ctrl+N`, CRUD transaksi, Transfer, Lampiran, dan Transaksi Berulang).
   - **Tahap 4:** Modul Anggaran (Budgeting), Utang/Piutang, dan Dashboard Visualisasi Grafik.
   - **Tahap 5:** Modul Laporan Filter Lanjutan, Import/Export (CSV/Excel/PDF), Backup/Restore, dan Halaman Pengaturan (termasuk Kunci PIN).

Mulai sekarang dengan **Tahap 1**. Jelaskan secara singkat struktur folder yang akan dibuat, lalu berikan kode lengkap untuk inisialisasi database dan skema SQLite-nya.
