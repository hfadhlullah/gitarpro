---
epic: "Project Scaffold"
layer: "L1-data"
role: "Fullstack"
status: "TODO"
---

# GTPR-001: Initialize Laravel Project + Inertia.js (React)

## Business Value
Provides the foundational monolithic application structure required for all subsequent development, replacing the need for separate frontend and backend repositories.

## Technical Details

**Implementation Steps:**
1. Initialize a new Laravel project: `composer create-project laravel/laravel . --force`
2. Install Laravel Breeze with React/Inertia stack: 
   - `composer require laravel/breeze --dev`
   - `php artisan breeze:install react --typescript`
3. Verify Vite compiles the frontend assets: `npm install && npm run build`.

**Files to Create/Modify:**
- `composer.json`
- `package.json`
- `vite.config.js`
- `resources/js/app.tsx`

## Acceptance Criteria
- [ ] `php artisan serve` runs the backend.
- [ ] `npm run dev` builds the React frontend successfully.
- [ ] Navigating to `localhost:8000` shows the default Laravel/Inertia landing page.
