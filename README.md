# GitarPro

A TikTok-style guitar community platform. Users share short video clips, browse a vertical feed, submit structured guitar lessons, and interact via likes and comments. Admins review and approve lessons through a Filament back-office panel.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 12, PHP 8.2+ |
| Frontend | React 18, TypeScript, Inertia.js v2 |
| Styling | Tailwind CSS v3, Vite 7 |
| Database | PostgreSQL 14 |
| File storage | MinIO (S3-compatible) |
| Admin panel | Filament v3 + Filament Shield (RBAC) |
| Auth | Laravel Breeze + Sanctum |
| Real-time | Laravel Reverb (WebSockets) + Echo |
| Queue | Database-backed queue worker |

## Prerequisites

- PHP 8.2+ with the `intl` extension available
- Composer
- Node.js 18+ and npm
- Docker and Docker Compose (for PostgreSQL and MinIO)

## Development Setup

### 1. Start infrastructure

```bash
docker compose up -d
```

This starts:
- **PostgreSQL 14** on `localhost:5433` (user: `gitarpro`, password: `password`, db: `gitarpro-dev`)
- **MinIO** on `localhost:9000` (API) and `localhost:9001` (console), with the `gitarpro-videos` bucket created automatically

### 2. Configure environment

```bash
cp .env.example .env
```

Update `.env` to match the Docker services:

```dotenv
APP_NAME=GitarPro
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5433
DB_DATABASE=gitarpro-dev
DB_USERNAME=gitarpro
DB_PASSWORD=password

FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=gitarpro-videos
AWS_ENDPOINT=http://127.0.0.1:9000
AWS_USE_PATH_STYLE_ENDPOINT=true
```

### 3. Install dependencies and initialise the database

```bash
composer run setup
```

This runs in order: `composer install` → copy `.env` if missing → `php artisan key:generate` → `php artisan migrate` → `npm install` → `npm run build`.

Then seed the database (admin user + roles + permissions):

```bash
php artisan db:seed
```

### 4. Run in development

```bash
composer run dev
```

This starts four concurrent processes:
- `php artisan serve` — Laravel dev server at `http://localhost:8000`
- `php artisan queue:listen` — processes background jobs
- `php artisan pail` — tails application logs
- `npm run dev` — Vite HMR dev server

> **Note on `intl`:** The project uses a custom `ServeCommand` (`app/Console/Commands/ServeCommand.php`) that injects `-d extension=intl` into the spawned `php -S` child process. This is required because `php artisan serve` spawns a child process that does not inherit ini overrides from the parent. No manual PHP configuration is needed.

## Credentials

| Account | Email | Password |
|---|---|---|
| Admin | `admin@mail.com` | `admin123123` |
| Regular user | register via `/register` | — |

The admin user is seeded only — it cannot be created through the registration flow. Regular users always receive the `user` Spatie role (with `view_feed`, `upload_video`, `view_lessons`, `submit_lesson` permissions) on registration.

## Key Routes

| URL | Description |
|---|---|
| `/` | Welcome / landing page |
| `/register` | User registration |
| `/login` | User login |
| `/feed` | TikTok-style video feed |
| `/upload` | Upload a video |
| `/lessons` | Browse published guitar lessons |
| `/profile` | Own profile |
| `/profile/{user}` | Any user's profile |
| `/settings` | Account settings |
| `/admin-panel` | Filament admin panel |
| `/admin-panel/shield/roles` | Role & permission editor |

## Admin Panel

The Filament admin panel (`/admin-panel`) is accessible to users with the `super_admin` Spatie role only.

From the panel you can:
- Manage users and assign roles
- Review, approve, or reject submitted lessons
- Configure roles and permissions via Filament Shield

## Useful Commands

```bash
# Run all tests
composer run test

# Build frontend assets for production
npm run build

# Re-run migrations from scratch (drops all tables)
php artisan migrate:fresh --seed

# Generate/refresh Filament Shield permissions for all resources
php artisan shield:generate --all --panel=admin

# Seed only the app-level permissions and user role
php artisan db:seed --class=AppPermissionsSeeder

# Inspect registered routes
php artisan route:list
```

## MinIO Console

Access the MinIO web console at `http://localhost:9001` (user: `minioadmin`, password: `minioadmin`) to browse stored videos and profile photos in the `gitarpro-videos` bucket.
