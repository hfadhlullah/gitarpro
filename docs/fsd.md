# Functional Specification Document (FSD)

## 1. System Architecture Strategy
The system follows a Modular Monolith architecture driven by Laravel and Inertia.js.

*   **Backend**: Laravel (PHP) acts as the primary web server. It handles routing, authentication (via Laravel Breeze), database interactions (via Eloquent ORM), and real-time event broadcasting.
*   **Frontend**: React (via Inertia.js) provides the user interface. Inertia natively passes data from Laravel controllers directly to React components as props, eliminating the need for a separate API JSON layer.
*   **Realtime Backend**: Laravel Reverb handles WebSocket connections to update the React client in real-time for likes and feed updates without third-party services.
*   **Media Storage**: S3-Compatible storage (MinIO) deployed alongside the app handles large video payloads.
*   **Interaction Flow (Upload)**:
    1.  Client requests an upload URL from a Laravel controller.
    2.  Laravel generates a pre-signed S3 URL using the `Storage` facade.
    3.  Client POSTs the video file directly to the S3 URL.
    4.  Upon success, Client triggers a Laravel route to save the video reference and associated Tab data in PostgreSQL.

---

## 2. Global Business Rules (BR)

### BR-01: Authentication & Authorization
*   **Unauthenticated Status**: Guests SHALL be able to view the global video feed and read associated tabs.
*   **Authenticated Status**: Only users with a valid session (via Laravel Breeze) SHALL be able to upload videos, create tabs, or mutate state (like/comment).

### BR-02: Video Upload Constraints
*   **Format**: The system SHALL only accept `.mp4` and `.webm` video formats to ensure broad browser compatibility.
*   **Size Limits**: Uploads SHALL NOT exceed 50MB per file for the MVP to manage self-hosted storage burn.
*   **Duration**: Video duration SHALL be limited to a maximum of 3 minutes.
*   **Aspect Ratio**: The UI SHALL expect and optimize for 9:16 (vertical) video formats, though 16:9 SHALL be supported with letterboxing.

### BR-03: Tab Data Structure
*   **Format Options**: The system SHALL support two tab formats:
    1.  `text`: A simple ASCII string block.
    2.  `graphical`: (Stretch goal/MVP consideration) A structured JSON array representing strings, frets, and timing.
*   **Attachment**: A Tab MUST be optionally attached to a Video. A Tab cannot exist in the feed without a parent Video.

### BR-04: Feed Pagination
*   **Infinite Scroll**: The vertical feed SHALL fetch videos in batches of 5 to minimize initial load time and bandwidth using Laravel's simple pagination.
*   **Real-time Updates**: Like counts on the currently focused video SHOULD update in real-time via Laravel Echo and Reverb.

---

## 3. Data Dictionary (PostgreSQL Schema Blueprint)

| Table | Column | Type | Description |
| :--- | :--- | :--- | :--- |
| **users** | `id` | BigInt (PK) | Auto-incrementing ID |
| | `name` | Varchar | Display name |
| | `email` | Varchar | User email (unique) |
| | `password` | Varchar | Hashed password |
| | `profile_photo_path` | Varchar (nullable) | S3 path to avatar |
| **videos** | `id` | BigInt (PK) | Auto-incrementing ID |
| | `user_id` | BigInt (FK) | Reference to users table |
| | `storage_key` | Varchar | S3/MinIO object key |
| | `title` | Varchar | Brief description/song name |
| **tabs** | `id` | BigInt (PK) | Auto-incrementing ID |
| | `video_id` | BigInt (FK) | Unique reference (1:1) to videos table |
| | `format` | Varchar | Enum: "text", "graphical" |
| | `content` | Text / JSONB | The raw ASCII or JSON fret data |
| **likes** | `id` | BigInt (PK) | Auto-incrementing ID |
| | `video_id` | BigInt (FK) | Reference to video |
| | `user_id` | BigInt (FK) | User who liked it |

---

## 4. API & Interface Standards

### Controller Standards (Inertia)
*   **Naming**: All controllers SHALL follow RESTful resource conventions (`FeedController`, `VideoController`, `LikeController`).
*   **Return Types**: Controllers rendering pages MUST return `Inertia::render('PageName', ['props' => ...])`. Endpoints serving asynchronous mutations (e.g., liking a video) MUST return JSON or HTTP Redirects (`back()`).

### Validation Standards
*   **Form Requests**: Custom FormRequest classes SHALL be used for all incoming data validation (e.g., `StoreVideoRequest`) to keep controllers clean.
*   **Error Handling**: Validation errors are automatically flashed to the session and passed to React props by Inertia as `errors`.

### UI State Standards
*   **Loading**: All asynchronous actions (swiping to a new video, submitting an upload) SHALL exhibit a clear visual loading state (spinner or skeleton) mapped to Inertia's progress events.
*   **Empty States**: If a user's profile has no videos, the system SHALL display a friendly empty state encouraging them to "Record their first cover."
