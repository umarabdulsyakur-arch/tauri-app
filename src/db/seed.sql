-- Data awal dompet default
INSERT INTO accounts (name, type, initial_balance, current_balance, color, icon) VALUES
    ('Kas Tunai', 'cash',    0, 0, '#10B981', 'banknote'),
    ('Rekening',  'bank',    0, 0, '#3B82F6', 'landmark'),
    ('E-Wallet',  'ewallet', 0, 0, '#8B5CF6', 'smartphone');

-- Kategori utama pengeluaran (expense)
INSERT INTO categories (name, type, color, icon) VALUES
    ('Makanan & Minuman',   'expense', '#EF4444', 'utensils'),
    ('Transportasi',        'expense', '#F59E0B', 'car'),
    ('Belanja',             'expense', '#EC4899', 'shopping-bag'),
    ('Tagihan & Utilitas',  'expense', '#F97316', 'receipt'),
    ('Kesehatan',           'expense', '#14B8A6', 'heart-pulse'),
    ('Hiburan',             'expense', '#A855F7', 'gamepad-2'),
    ('Pendidikan',          'expense', '#6366F1', 'graduation-cap'),
    ('Rumah Tangga',        'expense', '#84CC16', 'home'),
    ('Pakaian',             'expense', '#D946EF', 'shirt'),
    ('Lainnya (Pengeluaran)', 'expense', '#6B7280', 'more-horizontal');

-- Kategori utama pemasukan (income)
INSERT INTO categories (name, type, color, icon) VALUES
    ('Gaji',              'income', '#10B981', 'banknote'),
    ('Bonus',             'income', '#22C55E', 'award'),
    ('Bisnis / Usaha',    'income', '#16A34A', 'briefcase'),
    ('Investasi',         'income', '#059669', 'trending-up'),
    ('Hadiah',            'income', '#34D399', 'gift'),
    ('Lainnya (Pemasukan)', 'income', '#10B981', 'more-horizontal');

-- Subkategori contoh di bawah "Makanan & Minuman"
INSERT INTO categories (parent_id, name, type, color, icon)
SELECT id, 'Kopi & Jajan', 'expense', '#EF4444', 'coffee'
FROM categories
WHERE name = 'Makanan & Minuman' AND parent_id IS NULL;

INSERT INTO categories (parent_id, name, type, color, icon)
SELECT id, 'Makan di Luar', 'expense', '#F87171', 'utensils-crossed'
FROM categories
WHERE name = 'Makanan & Minuman' AND parent_id IS NULL;

-- Pengaturan default aplikasi (INSERT OR IGNORE agar idempoten)
INSERT OR IGNORE INTO settings (key, value) VALUES
    ('currency',          'IDR'),
    ('currency_symbol',   'Rp'),
    ('date_format',       'DD/MM/YYYY'),
    ('first_day_of_week', 'monday'),
    ('theme',             'system'),
    ('font_size',         'normal'),
    ('pin_enabled',       'false'),
    ('pin',               ''),
    ('idle_lock_minutes', '0'),
    ('auto_backup',       'false');
