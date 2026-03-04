---
epic: "Project Scaffold"
layer: "L1-data"
role: "Backend"
status: "TODO"
---

# GTPR-003: Configure Database & Run Auth Migrations

## Business Value
Allows user registration and session-based authentication to function natively via Laravel Breeze.

## Technical Details

**Implementation Steps:**
1. Update `.env` to wire up Postgres via the docker-compose setup: `DB_CONNECTION=pgsql`, `DB_HOST=127.0.0.1`, `DB_PORT=5432`, `DB_DATABASE=gitarpro-dev`, `DB_USERNAME=gitarpro`, `DB_PASSWORD=password`.
2. Delete SQLite default database config or file if present.
3. Run `php artisan migrate` to construct the Breeze `users`, `sessions`, and `password_reset_tokens` tables.
4. Verify Laravel session driver is set to `database`.

**Files to Create/Modify:**
- `.env`

## Acceptance Criteria
- [ ] `php artisan migrate` runs successfully connecting to Postgres Docker container.
- [ ] Visiting the `/register` route allows a new user account to be created.
- [ ] User remains authenticated and is redirected to `/dashboard` natively via Inertia.
