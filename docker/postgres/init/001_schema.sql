-- Initial schema bootstrap
-- This file is executed ONLY on first container creation
-- Example of users table:

CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'unverified',
  last_login TIMESTAMP
);

CREATE UNIQUE INDEX idx_users_email_unique
ON users (email);