# GitarPro Design System

## 1. Brand Identity & Vibe
**"Cinematic, Focused, High-Energy"**
GitarPro is an immersive environment for guitarists. To put the focus entirely on the video performances and the accompanying tabs, the UI frame must disappear.
*   **Theme**: True Dark Mode By Default. Heavy use of deep blacks and charcoal grays to create a "theater" effect around the videos.
*   **Accent Color**: Vibrant **Sunset Orange**. Used sparingly but aggressively for primary actions (Upload, Follow, Like active state) to evoke the energy of a live performance and contrast sharply against the dark background.

---

## 2. Design Tokens

### Colors
*   **Backgrounds**:
    *   `bg-background`: `#000000` (True black for the main feed container).
    *   `bg-surface`: `#09090B` (Zinc 950 - for modals, overlays, and bottom nav).
    *   `bg-surface-elevated`: `#18181B` (Zinc 900 - for hover states and cards).
*   **Text & Foreground**:
    *   `text-primary`: `#FAFAFA` (Zinc 50 - High contrast for readability).
    *   `text-secondary`: `#A1A1AA` (Zinc 400 - For usernames, timestamps, minor UI elements).
*   **Accents**:
    *   `color-accent`: `#FF4D00` (Sunset Orange - The primary brand and action color).
    *   `color-accent-hover`: `#CC3D00` (Deepened Sunset Orange).
*   **Utility**:
    *   `color-destructive`: `#EF4444` (Red 500).
    *   `color-success`: `#10B981` (Emerald 500).

### Typography
The typography must differentiate the UI from the raw musical data (tabs).
*   **UI Font (Sans-serif)**: `Inter`. Clean, highly legible at small sizes (crucial for mobile overlays).
    *   *Headings*: Semi-bold/Bold tracking tight.
    *   *Body*: Regular, tracking normal.
*   **Tab Font (Monospace)**: `Fira Code` or `JetBrains Mono`. Absolute requirement for rendering ASCII text tabs where character alignment is musically critical.
    *   *Tab Block*: `text-sm`, `leading-relaxed`.

### Spacing & Borders
*   **Border Radius**: `rounded-xl` (12px) for major components (buttons, small modals). The main video feed takes up the full screen height (no radius).
*   **Spacing**: Dense. The UI overlays the video, so padding MUST be tight to minimize visual obstruction of the player.

---

## 3. Core Components (shadcn/ui + Tailwind)

### 3.1 VideoFeed Container
*   **Concept**: Full viewport height (`h-[100dvh]`), snap-scrolling container.
*   **Styling**: `bg-black text-white w-full h-full snap-y snap-mandatory overflow-y-scroll`.
*   **Behavior**: Hides scrollbars. Each child video element is `h-full w-full snap-start snap-always relative`.

### 3.2 EngagementBar (Right Side Overlay)
*   **Concept**: A vertical stack of interaction buttons floating on the right side of the video, identical to TikTok.
*   **Positioning**: `absolute bottom-20 right-4 flex flex-col gap-6 items-center`.
*   **Icons**: White icons with a subtle drop shadow (`drop-shadow-md`) to ensure they are visible regardless of the video's lightness behind them.
*   **Active State (Like)**: Transforms to `text-[#FF4D00]` (Sunset Orange) with a pop animation.

### 3.3 TabOverlay (Bottom Sheet)
*   **Concept**: A bottom sheet that slides up when the user taps "View Tab".
*   **Styling**: `fixed bottom-0 left-0 w-full h-[60dvh] bg-zinc-950/90 backdrop-blur-md rounded-t-2xl border-t border-zinc-800`.
*   **Content Area**: 
    *   Must use the `font-mono` design token.
    *   Text color: `#E4E4E7` (Zinc 200) for high contrast against the dark blurred background.
    *   Overflow: `overflow-x-auto` to allow horizontal scrolling of long ASCII tab lines.

### 3.4 Action Button
*   **Concept**: Primary call to action (e.g., "Upload Cover", "Login").
*   **Styling**: `bg-[#FF4D00] text-white font-semibold rounded-xl px-4 py-2 hover:bg-[#CC3D00] transition-colors`.

---

## 4. Accessibility & Best Practices
*   **Contrast**: Text overlays on videos MUST have a text-shadow or a subtle dark gradient behind them (e.g., `bg-gradient-to-t from-black/80 to-transparent`) at the bottom of the video to ensure captions and usernames remain readable.
*   **Tap Targets**: All interactive elements over the video (Engagement Bar, Profile link) must have a minimum tap target of 44x44px.
*   **Animations**: Keep animations extremely fast. The core action is swiping videos; UI animations (like opening the Tab sheet) should use a snappy spring physics curve, not a slow ease.
