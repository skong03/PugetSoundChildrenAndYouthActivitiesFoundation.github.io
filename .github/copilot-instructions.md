# Copilot Instructions for Event Workflow

Use this workflow by default for this repository.

## Primary Skill: Add New Tiny Crafters Event
When the user says anything like:
- "add new event"
- "add event topic is ..."
- "upload image and create event"
- "run event skill"

Do ALL steps automatically unless user says otherwise:
1. Copy image from user-provided source (`~/Desktop` or `~/Downloads`) to `assets/img/<filename>`.
2. Add a new event object at the TOP of `tiny-crafter-event-data.json` under `events`.
3. Default event values:
   - `title`: `Tiny Crafters & storyTell workshop (Ages 4–6)`
   - `time`: `10:30am – 12:30pm`
   - `location`: `Issaquah`
   - day: next Sunday if date not provided
   - `description`: use standard existing Tiny Crafters description pattern in file
   - `eventTopic`: use provided topic text
   - `applyLink`: empty string
   - `photoGalleryLink`: empty string
4. Verify copied image exists.
5. If user asks commit/push, run:
   - `git add <changed files>`
   - `git commit -m "Add <topic> event"`
   - `git push origin main`

## Secondary Skill: Close Event and Add Gallery
When the user says anything like:
- "update event with gallery"
- "add photo gallery link"

Do:
1. Find target event by date/topic.
2. Set `eventTopic` to empty string (or remove it).
3. Set `photoGalleryLink` to provided Google Drive folder URL.
4. Keep all other fields unchanged.
5. Commit/push if requested.

## Notes
- Preserve JSON formatting/style used in the file.
- Keep changes minimal and only in requested files.
- Prefer direct action over asking extra questions when safe defaults apply.
