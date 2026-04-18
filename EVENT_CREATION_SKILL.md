# Event Creation Skill - Quick Reference

## 🎯 Purpose
Quickly add new Tiny Crafters events to `tiny-crafter-event-data.json` with minimal typing.

---

## 📝 Simple Commands

### **Create New Event**

Just say:
```
Add event, topic is [event topic], date [optional: date]
```

**Examples:**
- `Add event, topic is earth day`
- `Add event, topic is Mother's Day, date May 11`
- `Add event, topic is summer fun, date Jun 8`

---

## 🤖 What Gets Auto-Filled

Based on your standard pattern, Copilot will automatically set:

| Field | Auto-Filled Value |
|-------|------------------|
| **Location** | Issaquah |
| **Day** | Sunday (next upcoming if not specified) |
| **Time** | 10:30am – 12:30pm |
| **Title** | "Tiny Crafters & storyTell workshop (Ages 4–6)" |
| **Description** | Standard description template |
| **Event Topic** | Based on the topic you provide |
| **Apply Link** | Empty (uses eventTopic for Google Form) |
| **Photo Gallery** | Empty (to be added after event) |

---

## 📸 Update Event with Photos

After the event, add the photo gallery:

```
Update [date] event with gallery: [Google Drive link]
```

**Examples:**
- `Update Apr 20 event with gallery: https://drive.google.com/folders/...`
- `Update earth day event with gallery: https://drive.google.com/...`

This will:
- Remove the `eventTopic` (closes registration)
- Add the `photoGalleryLink`
- Change button from "Register Now" to "Photo Gallery"

---

## 🎨 Image Handling

By default, Copilot will ask you for the image filename. You can also specify it:

```
Add event, topic is earth day, image: earth.jpg
```

### **Auto-Copy from Desktop**

If your image is on the Desktop, just say:

```
The image is located at desktop. Copy it to proper location.
```

Copilot will automatically:
1. Copy the image from `~/Desktop/[filename]` to `assets/img/`
2. Verify the file was copied successfully
3. Confirm the file size and location

---

## 📅 Event Template Structure

When you create an event, this JSON structure is added:

```json
{
  "image": "assets/img/[your-image].jpg",
  "title": "Tiny Crafters & storyTell workshop (Ages 4–6)",
  "date": "Issaquah, Sunday, [Month] [Day], 2026 · 10:30am – 12:30pm",
  "eventTopic": "[Your Topic] [Month] [Day] 2026",
  "description": "A fun and enriching Sunday event for children ages 4–6! 10:30–11:30 Tiny Crafters (hands-on art & creativity). 11:30–12:00 Pizza lunch. 12:00–12:30 Little Piano Recital — a gentle and encouraging music sharing time. Limited spots available. Admission: $25 (voluntary).",
  "applyLink": "",
  "photoGalleryLink": ""
}
```

---

## 🔄 Typical Weekly Workflow

### **Before Event:**
1. Say: `Add event, topic is [next theme]`
2. Provide image filename when asked
3. Event is added to JSON with registration open

### **After Event:**
1. Upload photos to Google Drive
2. Get shareable folder link
3. Say: `Update [date] event with gallery: [link]`
4. Registration closes, photo gallery appears

---

## 💡 Pro Tips

- **Date Detection:** If you don't specify a date, Copilot will use the next Sunday
- **Consistent Naming:** Use simple, descriptive topics (e.g., "earth day", "mother's day", "summer fun")
- **Image Files:** Save images as lowercase with hyphens (e.g., `earth-day.jpg`)
- **Gallery Links:** Use "Copy link" from Google Drive (anyone with link can view)

---

## 📋 Quick Examples

```
You: Add event, topic is spring flowers
Copilot: [adds event for next Sunday with spring flowers topic]

You: Add event, topic is memorial day, date May 25
Copilot: [adds event for May 25, 2026]

You: Update Apr 20 event with gallery: https://drive.google.com/folders/abc123
Copilot: [closes registration, adds photo gallery link]
```

---

## ✅ Best Practices

1. **One event at a time** - Add events individually for accuracy
2. **Verify dates** - Copilot will confirm the date before adding
3. **Image prep** - Upload image to `assets/img/` folder first
4. **Test registration** - Click "Register Now" to verify Google Form pre-fills correctly
5. **Gallery visibility** - Make sure Drive folder is set to "Anyone with link can view"

---

## 🚀 That's It!

No more manual JSON editing. Just tell Copilot what event to add in plain English!
