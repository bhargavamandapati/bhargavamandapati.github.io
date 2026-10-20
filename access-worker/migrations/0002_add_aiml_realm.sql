-- Adds the third realm, 'aiml' (AI & ML), to the three tables whose realm column
-- carries a CHECK constraint. SQLite cannot alter a CHECK in place, so each
-- table is rebuilt: copy out, drop, recreate with the wider constraint, copy
-- back, recreate the indexes. Existing rows are copied across unchanged.
--
-- Apply with:  npm run db:migrate:remote   (from access-worker/)
-- Run it BEFORE deploying the Worker that accepts realm=aiml.

PRAGMA foreign_keys = OFF;

-- access_codes
CREATE TABLE access_codes_new (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL REFERENCES subscribers(email),
  realm TEXT NOT NULL CHECK (realm IN ('learn', 'sdv', 'aiml')),
  code_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  issued_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  revoked_at TEXT
);
INSERT INTO access_codes_new SELECT id, email, realm, code_hash, status, issued_at, expires_at, revoked_at FROM access_codes;
DROP TABLE access_codes;
ALTER TABLE access_codes_new RENAME TO access_codes;
CREATE INDEX idx_access_codes_email_realm ON access_codes(email, realm);
CREATE INDEX idx_access_codes_status_expires ON access_codes(status, expires_at);

-- payments
CREATE TABLE payments_new (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL REFERENCES subscribers(email),
  realm TEXT NOT NULL CHECK (realm IN ('learn', 'sdv', 'aiml')),
  amount TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  method TEXT,
  reference TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT INTO payments_new SELECT id, email, realm, amount, currency, period_start, period_end, method, reference, notes, created_at FROM payments;
DROP TABLE payments;
ALTER TABLE payments_new RENAME TO payments;
CREATE INDEX idx_payments_email ON payments(email);

-- realm_keys
CREATE TABLE realm_keys_new (
  realm TEXT PRIMARY KEY CHECK (realm IN ('learn', 'sdv', 'aiml')),
  current_key TEXT NOT NULL,
  rotated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT INTO realm_keys_new SELECT realm, current_key, rotated_at FROM realm_keys;
DROP TABLE realm_keys;
ALTER TABLE realm_keys_new RENAME TO realm_keys;

PRAGMA foreign_keys = ON;
