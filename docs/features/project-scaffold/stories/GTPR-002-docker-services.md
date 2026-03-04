---
epic: "Project Scaffold"
layer: "L1-data"
role: "Backend"
status: "TODO"
---

# GTPR-002: Configure Docker Compose (Postgres + MinIO)

## Business Value
Provides the self-hosted database and S3-compatible infrastructure required to serve videos and manage relational data for Laravel.

## Technical Details

**Implementation Steps:**
1. Create a `docker-compose.yml` file in the project root.
2. Define the `db` service utilizing the `postgres:15` image mapped to port 5432.
3. Define the `minio` service utilizing the `minio/minio:latest` image mapped to ports `9000` (API server) and `9001` (Web console).
4. Map correct docker volumes (e.g. `pgdata:/var/lib/postgresql/data`, `minio_data:/data`) to persist container data.
5. Create initial env vars for postgres (`POSTGRES_DB`, etc) and Minio (`MINIO_ROOT_USER`, etc).

**Files to Create/Modify:**
- `docker-compose.yml`

## Acceptance Criteria
- [ ] `docker compose up -d` starts both containers persistently.
- [ ] Next step (GTPR-003) can successfully migrate the database without connectivity errors.
- [ ] MinIO web console loads on `localhost:9001`.
