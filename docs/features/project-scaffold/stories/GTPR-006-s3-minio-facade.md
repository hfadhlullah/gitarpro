---
epic: "Project Scaffold"
layer: "L3-backend"
role: "Backend"
status: "TODO"
---

# GTPR-006: Configure S3 Storage Facade (MinIO)

## Business Value
Allows uploading MP4/WEBM files directly via Presigned S3 URLs natively handled by Laravel's built-in File System engine without locking us into AWS.

## Technical Details

**Implementation Steps:**
1. Install AWS flysystem adapter: `composer require league/flysystem-aws-s3-v3`.
2. Update `.env` storage mapping:
   - `FILESYSTEM_DISK=s3`
   - `AWS_ACCESS_KEY_ID=minioadmin`
   - `AWS_SECRET_ACCESS_KEY=minioadmin`
   - `AWS_USE_PATH_STYLE_ENDPOINT=true` (Required for MinIO compatability)
   - `AWS_ENDPOINT=http://127.0.0.1:9000`
   - `AWS_BUCKET=gitarpro-videos`
3. Validate that `config/filesystems.php` accepts the path_style definition for the s3 disk parameter.

**Files to Create/Modify:**
- `composer.json`
- `config/filesystems.php`
- `.env`

## Acceptance Criteria
- [ ] `league/flysystem-aws-s3-v3` package installs.
- [ ] Running a basic factory or Tinker session `Storage::disk('s3')->directories()` queries localhost successfully via MinIO integration.
