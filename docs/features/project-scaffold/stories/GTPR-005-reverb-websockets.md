---
epic: "Project Scaffold"
layer: "L3-backend"
role: "Backend"
status: "TODO"
---

# GTPR-005: Setup Laravel Reverb (WebSockets)

## Business Value
Facilitates real-time features like live feed likes, comment notifications, and instant upload processing updates natively without relying on a paid third-party WebSocket service. 

## Technical Details

**Implementation Steps:**
1. Run `php artisan install:broadcasting` and accept all prompts to install Laravel Echo (React/Frontend) and Laravel Reverb (Backend). 
2. Let artisan update the `.env` configuration implicitly to configure Reverb environment variables.
3. Validate Reverb connects successfully via `php artisan reverb:start`.
4. Include Echo bootstrap configuration in `resources/js/echo.js` or `bootstrap.js` as generated.

**Files to Create/Modify:**
- `config/broadcasting.php`
- `routes/channels.php`
- `resources/js/echo.js`

## Acceptance Criteria
- [ ] `php artisan reverb:start` runs locally without crashing.
- [ ] Echo dependencies are installed correctly via Vite build step.
