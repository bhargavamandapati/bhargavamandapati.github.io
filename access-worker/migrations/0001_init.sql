-- Every person who has ever paid, independent of whether they currently have
-- live access to anything.
CREATE TABLE subscribers (
  email TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- One row per issued code. A new issuance for the same (email, realm)
-- revokes the previous active one rather than stacking a second valid code —
-- enforced in application code, not a constraint, because SQLite can't express
-- "unique among rows where status='active'" directly.
CREATE TABLE access_codes (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL REFERENCES subscribers(email),
  realm TEXT NOT NULL CHECK (realm IN ('learn', 'sdv')),
  code_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  issued_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  revoked_at TEXT
);

CREATE INDEX idx_access_codes_email_realm ON access_codes(email, realm);
CREATE INDEX idx_access_codes_status_expires ON access_codes(status, expires_at);

-- Append-only. Never updated or deleted by expiry/revocation — this is the
-- permanent record, independent of whatever access_codes currently says.
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL REFERENCES subscribers(email),
  realm TEXT NOT NULL CHECK (realm IN ('learn', 'sdv')),
  amount TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  method TEXT,
  reference TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_payments_email ON payments(email);

-- The current content-decryption key per realm, rotated monthly by the
-- scheduled handler. Not a Workers Secret, deliberately: a secret is
-- read-only from inside the Worker, and rotation has to write a new value.
CREATE TABLE realm_keys (
  realm TEXT PRIMARY KEY CHECK (realm IN ('learn', 'sdv')),
  current_key TEXT NOT NULL,
  rotated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- A simple D1-backed rate limit for POST /unlock, keyed by IP+email so one
-- guesser can't brute-force a code. Rows older than a day are pruned by the
-- monthly sweep; the table stays tiny between rotations regardless since
-- legitimate traffic to this endpoint is low.
CREATE TABLE unlock_attempts (
  rate_key TEXT NOT NULL,
  ts TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_unlock_attempts_key_ts ON unlock_attempts(rate_key, ts);
