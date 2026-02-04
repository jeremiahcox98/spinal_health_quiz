# Troubleshooting Notion Submission

## If data isn't being pushed to Notion, check these:

### 1. Check Browser Console

Open your browser's Developer Tools (F12) and check the Console tab when you submit the quiz. Look for:
- Error messages
- "Submitting to: /api/submit"
- "Response status: XXX"

### 2. Check Cloudflare Pages Function Logs

1. Go to Cloudflare Dashboard → Pages → Your Project
2. Click on the latest deployment
3. Go to **Functions** tab
4. Look for error logs or console.log output

### 3. Verify Environment Variables

In Cloudflare Pages:
1. Go to **Settings** → **Environment Variables**
2. Verify both variables are set for **Production**:
   - `NOTION_API_TOKEN` = (should be encrypted/shown as dots)
   - `NOTION_DATABASE_ID` = `2fdea7f8f24d80ae8468e64a3659ce98`

**Important:** Make sure they're set for the correct environment (Production, not Preview)

### 4. Verify Notion Integration

1. Go to your Notion database: https://www.notion.so/jcox/2fdea7f8f24d80ae8468e64a3659ce98
2. Click the "..." menu (top right)
3. Click "Connections" or "Add connections"
4. Make sure your integration is connected to the database

### 5. Verify Database Properties

Your Notion database must have these exact properties (case-sensitive):

- **Email** (Email type)
- **Date/Time** (Date type)
- **Total Score** (Number type)
- **Score Percentage** (Number type)
- **Severity Level** (Select type with options: `Excellent`, `Moderate`, `Significant`)

### 6. Test the API Directly

You can test the function directly using curl or Postman:

```bash
curl -X POST https://spinal-health-quiz.pages.dev/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "answers": [0,1,2,0,1,2,0,1,2,0],
    "questions": [
      {
        "question": "Test question?",
        "answers": [
          {"text": "Yes", "value": 0},
          {"text": "No", "value": 1}
        ]
      }
    ]
  }'
```

This will show you the exact error message.

### 7. Common Errors

**Error: "Missing Notion credentials"**
- Environment variables not set in Cloudflare Pages
- Check Settings → Environment Variables

**Error: "Database not found" or "Invalid database ID"**
- Database ID is incorrect
- Make sure it's: `2fdea7f8f24d80ae8468e64a3659ce98`

**Error: "Integration not connected"**
- Your Notion integration isn't shared with the database
- Go to database → Connections → Add your integration

**Error: "Property not found"**
- Database is missing required properties
- Check property names match exactly (case-sensitive)

**Error: 401 Unauthorized**
- API token is incorrect or expired
- Regenerate token in Notion integrations

**Error: 404 Not Found**
- Database ID is wrong
- Integration not connected to database

### 8. Check Function Logs in Real-Time

After updating the function with better logging:
1. Submit the quiz
2. Go to Cloudflare Dashboard → Pages → Your Project → Functions
3. Check the logs for detailed error messages

### 9. Redeploy After Changes

If you update environment variables:
1. Go to Settings → Environment Variables
2. Save changes
3. Go to Deployments
4. Click "Retry deployment" or push a new commit
