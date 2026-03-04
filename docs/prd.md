# Product Requirements Document (PRD): GitarPro

## 1. Overview
| Attribute | Value |
| :--- | :--- |
| **Product Name** | GitarPro |
| **Target Launch** | Next Week (MVP) |
| **Status** | Drafting |
| **Owner** | [ASSUMPTION: Product Team] |

---

## 2. Quick Links
- [Design Sandbox](#) (Placeholder)
- [Technical Specifications](#) (Placeholder)
- [Project Board](#) (Placeholder)

---

## 3. Background
Many guitarists and musicians struggle to find a dedicated space to share their covers, original songs, and tabs without getting lost in the noise of general-purpose social media (like TikTok or Instagram). Existing guitar-focused apps often lack a modern, engaging UI to encourage community interaction.

**GitarPro** aims to bridge this gap by providing a focused group for musicians who like to share their covers or songs, utilizing a highly engaging, TikTok-inspired vertical swipe interface.

---

## 4. Objectives
- **Business Objective 1:** Launch the MVP within the 1-week timeline to begin user acquisition immediately.
- **Business Objective 2:** Establish initial user growth and content seeding.
- **User Objective 1:** Provide a seamless, dedicated platform for guitarists to upload and share video covers and tabs.
- **User Objective 2:** Enable an addictive, streamlined viewing experience for consuming other musicians' covers.

---

## 5. Success Metrics
| Metric | Baseline | Target (30 Days Post-Launch) | Measurement Method |
| :--- | :--- | :--- | :--- |
| **Monthly Active Users (MAU)** | 0 | [ASSUMPTION: 500] | App Analytics / DB Queries |
| **Content Uploads (Videos/Tabs)** | 0 | [ASSUMPTION: 100 per week] | Database Table Counts (`videos`, `tabs`) |
| **App Registration Rate** | 0% | [ASSUMPTION: 20% of visitors] | Analytics Funnel Setup |

---

## 6. Scope

**MVP Context:** A rapid rollout focused on core video sharing and tab functionality with an engaging UI.

| Feature | In Scope? | Reasoning / Details |
| :--- | :--- | :--- |
| User Registration & Auth | ✅ | Basic JWT implementation required for personalized feeds and uploading. |
| TikTok-style Vertical Feed | ✅ | Core differentiator for UI/engagement. |
| Video Uploads (Covers/Songs) | ✅ | Core value proposition for the focus group. |
| Tab Creation/Viewing (Text/Graphical) | ✅ | Essential utility for guitar players sharing knowledge. |
| Lessons | ❌ | Deferred to v2; focus is on the community sharing MVP right now. |
| Complex Social (DMs, Groups) | ❌ | Keep MVP simple; stick to likes/comments for now. |

---

## 7. User Flow

```text
# Main User Journey: Uploading a Cover
1. User opens the web app.
2. User authenticates (Login/Signup).
3. User navigates to "Upload" screen.
4. User attaches an MP4 video of their guitar cover.
5. User optionally attaches a corresponding Tab (Text or Graphical).
6. User submits.
7. System processes video and confirms upload.
8. Video appears in the global vertical swipe feed.

# Main User Journey: Consuming Content
1. User opens the web app (Lands on Feed).
2. Video autoplay begins.
3. User swipes UP to see the next cover.
4. User taps on the screen to view the associated Tab (if attached).
```

---

## 8. User Stories

| ID | Story | Acceptance Criteria |
| :--- | :--- | :--- |
| US-01 | As an unauthenticated user, I want to sign up or log in, so that I can upload my covers. | **Given** I am on the login page<br>**When** I enter valid credentials<br>**Then** I receive a JWT and am routed to the feed.<br>**Given** invalid credentials<br>**Then** I see an error message. |
| US-02 | As a musician, I want to view a vertical feed of covers, so that I can discover new talent. | **Given** I am on the home page<br>**When** the page loads<br>**Then** a video cover begins playing automatically.<br>**When** I swipe/scroll down<br>**Then** the next video smoothly loads and plays. |
| US-03 | As a creator, I want to upload a video cover, so that others can watch my performance. | **Given** I am logged in<br>**When** I navigate to upload and submit a valid video file<br>**Then** it is saved to the server and pushed to the feed. |
| US-04 | As a creator, I want to write or attach a tab to my video, so that viewers can learn my cover. | **Given** I am in the upload screen<br>**When** I fill out the "Tab" section (graphical/text)<br>**Then** it is linked to my uploaded video. |
| US-05 | As a viewer, I want to open the tab for a video I am watching, so I can play along. | **Given** I am watching a video with an attached tab<br>**When** I click the "View Tab" button<br>**Then** the tab displays clearly without disrupting the video severely. |

---

## 9. Analytics

| Event Name | Trigger Condition | JSON Payload Example |
| :--- | :--- | :--- |
| `app_open` | Landing page loads | `{ "timestamp": "...", "device": "web" }` |
| `signup_success` | User completes registration | `{ "user_id": "123", "method": "email" }` |
| `video_uploaded` | Video finishes server processing | `{ "user_id": "123", "has_tab": true, "size_mb": 15 }` |
| `video_swiped` | User scrolls to the next video | `{ "video_id": "456", "watch_time_sec": 12 }` |
| `tab_viewed` | User clicks the 'View Tab' button | `{ "video_id": "456", "tab_format": "text" }` |

---

## 10. Open Questions

| Question | Owner | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Self-Hosting Limits** | Technical | Open | What are the bandwidth and storage constraints of the target self-hosted environment for heavy video traffic? |
| **Video Transcoding** | Technical | Open | Should the app transcode uploads to HLS for smooth streaming, or just serve raw MP4s for the MVP timeline? |
| **Content Moderation** | Product | Open | Given the timeline, do we need automated moderation, or is retroactive manual banning sufficient? |

---

## 11. Notes
- **Hosting Strategy:** The application will be self-hosted. Architecture and technology choices must optimize for this (e.g., managing static assets/videos efficiently on a single VPS or dedicated server footprint).
- **Timeline Pressure:** With a 1-week target for MVP, complex features like full real-time collaborative tab editing are firmly out of scope. We will rely on simple string inputs or basic JSON visual generation for tabs.

---

## 12. Appendix
- **Definitions:**
  - **Tab:** A musical notation indicating instrument fingering rather than musical pitches.
  - **MVP:** Minimum Viable Product.
