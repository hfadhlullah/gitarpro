---
epic: "Project Scaffold"
layer: "L5-integration"
role: "Fullstack"
status: "TODO"
---

# GTPR-007: Integration Smoke Test 

## Business Value
Validates our entire Modular Monolith runs smoothly: Database updates push real-time events through WebSockets to React.

## Technical Details

**Implementation Steps:**
1. Write a dummy TestController route (`/test-scaffold`).
2. Have the controller insert a dummy row to a database (to test Postgres connection).
3. Have the controller attempt to write a dummy text file to `Storage::disk('s3')->put('test.txt', 'hello')` (to test MinIO path resolution).
4. Throw a dummy Event (`class ScaffoldTested implements ShouldBroadcast`) which broadcasts via Reverb.
5. In React via Inertia, display `{test_result}` props passing data through natively from Laravel. Listen to Reverb (`Echo.channel(...)`) indicating broadcast success via `console.log`.

**Files to Create/Modify:**
- `routes/web.php`
- (No need to persist the UI post-test—this story's PR just needs to demonstrate functionality once, then rip it out.)

## Acceptance Criteria
- [ ] React loads page securely without throwing React hydration issues.
- [ ] Controller action mutates DB normally.
- [ ] Storage stores to MinIO S3 cleanly.
- [ ] Reverb logs connection WebSocket broadcasts successfully.
