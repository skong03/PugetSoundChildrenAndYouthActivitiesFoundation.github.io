# Simple Registration System - Implementation Guide

## 🎯 Problem Solved
Stop creating a new Google Form every week! Use ONE form for all events with auto-filled event names.

---

## ✅ What You Have

**Google Form:** https://docs.google.com/forms/d/e/1FAIpQLScbiG_CegaRlwJMCjCXdvKy6YiXXHoorUj1GpOCnGAgWnK14Q/viewform

**Pre-fill Configuration:**
- Form Base: `https://docs.google.com/forms/d/e/1FAIpQLScbiG_CegaRlwJMCjCXdvKy6YiXXHoorUj1GpOCnGAgWnK14Q/viewform`
- Entry ID: `entry.1874168488`
- Pre-fills the "Which event?" question

---

## 📝 Code Updates (✅ COMPLETED)

The following files have been updated:
- ✅ `tiny-crafter-events.html`
- ✅ `badminton-events.html`

Both now support the new `eventTopic` field for automatic Google Form pre-filling.

---

## 🔄 Your New Weekly Workflow

### **For NEW upcoming events:**

```json
{
  "image": "assets/img/new-event.jpg",
  "title": "Tiny Crafters Workshop",
  "date": "Issaquah, Sunday, Apr 27th, 2026 · 10:30am – 12:30pm",
  "eventTopic": "Tiny Crafters Apr 27 2026",
  "description": "Your event description...",
  "applyLink": "",
  "photoGalleryLink": ""
}
```

**Key points:**
- ✅ Add `eventTopic` field with a short identifier (e.g., "Tiny Crafters Apr 27 2026")
- ✅ Leave `applyLink` empty or remove it
- ✅ This will show "Register Now" button that opens your Google Form with the event auto-filled

### **For PAST events (close registration):**

```json
{
  "image": "assets/img/past-event.jpg",
  "title": "Tiny Crafters Workshop",
  "date": "Issaquah, Sunday, Apr 20th, 2026 · 10:30am – 12:30pm",
  "eventTopic": "",
  "description": "Your event description...",
  "applyLink": "",
  "photoGalleryLink": "https://drive.google.com/folders/..."
}
```

**Key points:**
- ✅ Remove or empty `eventTopic` field
- ✅ Add `photoGalleryLink` 
- ✅ Registration button disappears, Photo Gallery button appears

---

## 🎉 Benefits

✅ **No more creating Google Forms weekly** - use one form forever  
✅ **Automatic event pre-filling** - users see which event they're registering for  
✅ **All data in one spreadsheet** - easy to manage and filter  
✅ **Simple weekly updates** - just change JSON, no form creation  
✅ **Old events still work** - keeps backward compatibility with existing `applyLink` fields

---

## 📊 Google Sheets Tip

In your Google Sheets (linked to the form):
1. Click the filter icon
2. Filter by the event name column
3. See all registrations for a specific event

Or create a pivot table to count registrations by event!

---

## 🐛 Troubleshooting

**Q: Register button not showing?**  
A: Make sure `eventTopic` field has a value and is not empty

**Q: Form doesn't have event pre-filled?**  
A: Check that `GOOGLE_FORM_BASE` and `EVENT_ENTRY_ID` are correct in the HTML files

**Q: Old events still showing register button?**  
A: Remove or empty the `eventTopic` field in your JSON for those events

---

## 📞 Next Steps

1. ✅ ~~Update `tiny-crafter-events.html`~~ DONE
2. ✅ ~~Update `badminton-events.html`~~ DONE
3. 🔲 Test with one event - add `eventTopic` to a JSON entry
4. 🔲 Click "Register Now" and verify the form opens with event pre-filled
5. 🔲 Roll out to all upcoming events!

---

## 📝 Example Test

To test, add this to the first event in your `tiny-crafter-event-data.json`:

```json
{
  "image": "assets/img/7177.JPG",
  "title": "Tiny Crafters & storyTell workshop (Ages 4–6)",
  "date": "Issaquah, Sunday, Mar 29th, 2026 · 10:30am – 12:30pm",
  "eventTopic": "Tiny Crafters Mar 29 2026",
  "description": "A fun and enriching Sunday event for children ages 4–6!...",
  "applyLink": "",
  "photoGalleryLink": ""
}
```

Then open `tiny-crafter-events.html` in a browser and click "Register Now" to see the Google Form with the event auto-filled!
