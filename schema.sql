CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  address TEXT NOT NULL,
  transfer_ref TEXT,
  created_at TEXT NOT NULL
);
