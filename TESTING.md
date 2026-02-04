# Testing the Quiz Locally

## Quick Setup (5 minutes)

### Step 1: Install Wrangler (if not installed)

```bash
npm install -g wrangler
```

Or if you don't have npm:
```bash
# Install Node.js first from nodejs.org, then run the npm command above
```

### Step 2: Create your .dev.vars file

The file is already created. Just edit it and add your Notion database ID:

```bash
# Open .dev.vars in your editor
# Replace "your_database_id_here" with your actual database ID
```

**To get your database ID:**
1. Open your Notion database in a browser
2. Look at the URL: `https://www.notion.so/workspace/DATABASE_ID?v=...`
3. Copy the 32-character string (the database ID)

### Step 3: Login to Cloudflare

```bash
wrangler login
```

This will open a browser window for you to authenticate.

### Step 4: Run the local server

```bash
wrangler pages dev . --compatibility-date=2024-01-01
```

You'll see output like:
```
 ⛅️ wrangler pages dev
👂 Listening on http://localhost:8788
```

### Step 5: Open in browser

Open `http://localhost:8788/spinal-health-quiz.html` in your browser and test the quiz!

---

## Alternative: Test Without Cloudflare (Quick Test)

If you want to test the quiz UI without the Notion integration:

1. Just open `spinal-health-quiz.html` directly in your browser
2. The quiz will work, but the Notion submission will fail (which is expected)
3. You'll still see the results page

---

## Troubleshooting

**"wrangler: command not found"**
- Install Node.js from nodejs.org
- Then run: `npm install -g wrangler`

**"Cannot find module" errors**
- Make sure you're in the project directory
- Run: `npm install` (if there's a package.json)

**API endpoint not working**
- Make sure `.dev.vars` exists and has your credentials
- Check that you're accessing via `http://localhost:8788` (not file://)

**Need help?**
- Check the browser console (F12) for errors
- Check the terminal where Wrangler is running for server errors
