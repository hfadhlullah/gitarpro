# PRD Addendum: [FOUNDATION] Project Scaffold

## 1. Feature Metadata
| Attribute | Value |
| :--- | :--- |
| **Feature Name** | Project Scaffold |
| **Parent Epic** | Foundation |
| **Status** | In Progress |
| **Type** | Infrastructure / Foundation |

---

## 2. Objective
Establish a fully runnable, locally-executable development environment that serves as the foundation for all subsequent feature work.

All downstream features depend on this scaffold being complete **using the Laravel + Inertia.js (React) monolithic stack**. 

---

## 3. Acceptance Criteria

| # | Criterion | How to Verify |
| :--- | :--- | :--- |
| AC-01 | `php artisan serve` starts the backend and `npm run dev` builds the Vite/React frontend seamlessly. | Load `localhost:8000` to see the React frontend load without errors. |
| AC-02 | PostgreSQL container is running via Docker Compose and accessible at `localhost:5432`. | Connect a database client locally and verify connectivity, or run `php artisan migrate`. |
| AC-03 | MinIO S3-compatible container is running via Docker Compose. | Visit `localhost:9001` (MinIO console) and verify access. |
| AC-04 | Laravel Breeze is installed providing native auth flows (Register/Login). | Visit `/register` and successfully create a user inside the Postgres database. |
| AC-05 | shadcn/ui is initialized for the React frontend, and at least one component renders with the Sunset Orange theme. | Render a `<Button>` in `resources/js/Pages/Welcome.tsx` and confirm primary color matches `#FF4D00`. |
| AC-06 | Laravel Reverb is installed and broadcasting locally. | `php artisan reverb:start` runs successfully. |

---

## 4. Folder Structure (Target State After Scaffold)

```
gitarpro/
├── app/
│   ├── Http/Controllers/   # Routing logic
│   └── Models/             # Eloquent Models (User)
├── bootstrap/
├── config/
├── database/
│   └── migrations/         # Database table schemas
├── public/                 # Built Vite assets
├── resources/
│   ├── css/
│   │   └── app.css         # Tailwind directives + theme tokens
│   └── js/
│       ├── Components/     # shadcn/ui components
│       ├── Layouts/        # Global page layouts
│       └── Pages/          # Inertia React views
├── routes/
│   ├── web.php             # Web endpoints and Inertia render calls
│   └── channels.php        # WebSocket channels
├── .env                    # Secrets (DB, MinIO, Reverb configuration)
├── docker-compose.yml      # MinIO and Postgres services
├── tailwind.config.js      # Custom theme setup
└── vite.config.js          # Asset bundling
```

---

## 5. Docker Compose Spec

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: gitarpro
      POSTGRES_PASSWORD: password
      POSTGRES_DB: gitarpro-dev
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"   
      - "9001:9001"   
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data

volumes:
  pgdata:
  minio_data:
```

---

## 6. Environment Variables Outline (`.env`)

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=gitarpro-dev
DB_USERNAME=gitarpro
DB_PASSWORD=password

# Storage (MinIO)
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=gitarpro-videos
AWS_USE_PATH_STYLE_ENDPOINT=true
AWS_ENDPOINT=http://127.0.0.1:9000
```
