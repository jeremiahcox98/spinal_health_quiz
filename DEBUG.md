# Debugging Notion Submission

## Quick Checklist

1. **Check your `.dev.vars` file:**
   - Open `.dev.vars` 
   - Make sure `NOTION_DATABASE_ID` is set to your actual database ID (not "your_database_id_here")
   - Database ID should be a 32-character string

2. **Check browser console:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for error messages when you submit
   - You should see logs like:
     - "Submitting to: /api/submit"
     - "Response status: 200" (or an error code)

3. **Check Wrangler terminal:**
   - Look at the terminal where `wrangler pages dev` is running
   - Check for any error messages from the function

4. **Common Issues:**

   **Issue: "Missing Notion credentials"**
   - Your `.dev.vars` file isn't being loaded
   - Make sure the file is named exactly `.dev.vars` (not `.dev.vars.example`)
   - Restart Wrangler after editing `.dev.vars`

   **Issue: "Database not found" or "Invalid database ID"**
   - Your database ID is incorrect
   - Make sure you copied the full 32-character ID from the Notion URL
   - Remove any hyphens if present

   **Issue: "Integration not connected"**
   - Your Notion integration isn't shared with the database
   - Go to your Notion database → "..." menu → "Add connections" → Select your integration

   **Issue: "Property not found"**
   - Your database is missing required properties
   - Check that these properties exist:
     - Email (Email type)
     - Date/Time (Date type)
     - Total Score (Number type)
     - Score Percentage (Number type)
     - Severity Level (Select type with options: Excellent, Moderate, Significant)

## Get Your Database ID

1. Open your Notion database in a browser
2. Look at the URL: `https://www.notion.so/workspace/abc123def456...?v=...`
3. The database ID is the long string after the last `/` and before the `?`
4. It should be 32 characters (may have hyphens - remove them)
5. Example: If URL is `https://www.notion.so/abc-123-def-456`, the ID is `abc123def456`

## Test the API Directly

You can test the function directly using curl:

```bash
curl -X POST http://localhost:8788/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "answers": [0,1,2,0,1,2,0,1,2,0],
    "questions": [
      {"question": "Test?", "answers": [{"text": "Yes", "value": 0}]}
    ]
  }'
```

This will show you the exact error message from the function.
