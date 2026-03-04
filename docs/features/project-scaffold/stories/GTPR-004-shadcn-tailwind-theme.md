---
epic: "Project Scaffold"
layer: "L2-ui-foundation"
role: "Frontend"
status: "TODO"
---

# GTPR-004: Initialize shadcn/ui + Tailwind Theme in React

## Business Value
Enables rapid, high-quality feature UI building aligned perfectly with our cinematic theme, leveraging Inertia.js React components directly.

## Technical Details

**Implementation Steps:**
1. Install `shadcn/ui` dependencies (npx shadcn@latest init) targeting `resources/js/Components`.
2. Update `tailwind.config.js` to match the PRD Addendum:
   - Add Custom `accent` color for `Sunset Orange (#FF4D00)`.
   - Update `app.css` providing literal black backgrounds (`#000000`) and the base surface colors.
3. Apply standard Google Fonts for typography (`Inter` for base app text, `JetBrains Mono` or `Fira Code` for rendering Tabs) inside `resources/views/app.blade.php`.
4. Run `npx shadcn@latest add button` and render it onto the `resources/js/Pages/Welcome.tsx` component to verify initialization worked.

**Files to Create/Modify:**
- `tailwind.config.js`
- `resources/css/app.css`
- `resources/views/app.blade.php`
- `resources/js/Components/ui/button.tsx`
- `resources/js/Pages/Welcome.tsx`

## Acceptance Criteria
- [ ] Tailwind applies `#000000` true dark background.
- [ ] `<Button>` from shadcn renders on the Inertia welcome page correctly in `Sunset Orange` accent.
