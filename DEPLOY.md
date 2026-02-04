# Deployment Guide - GitHub to Cloudflare Pages

## Pre-Deployment Checklist

✅ **Project Structure:**
- [x] `spinal-health-quiz.html` - Main quiz file
- [x] `functions/api/submit.js` - Cloudflare Pages Function
- [x] `.gitignore` - Excludes sensitive files
- [x] `README.md` - Documentation

✅ **Security:**
- [x] `.dev.vars` is in `.gitignore` (won't be committed)
- [x] API token is NOT in code (uses environment variables)
- [x] All sensitive data handled server-side

## Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Spinal Health Quiz with Notion integration"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Connect GitHub to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → **Create a project**
3. Click **Connect to Git**
4. Select your GitHub account and repository
5. Configure build settings:
   - **Framework preset:** None (or "None")
   - **Build command:** `echo "No build needed"` (or `true`)
   - **Deploy command:** ⚠️ **MUST BE EMPTY** - Delete `npx wrangler deploy` completely!
     - If it won't let you leave it blank, use: `echo "Deploying"`
   - **Build output directory:** (leave empty)
   - **Root directory:** `/` (root of repo)
   
   **CRITICAL:** 
   - There are TWO separate fields: "Build command" and "Deploy command"
   - The "Deploy command" field is what's causing the error - it has `npx wrangler deploy`
   - Cloudflare Pages handles deployment automatically - you don't need a deploy command!
   - Cloudflare Pages will automatically detect your `functions/` directory

## Step 3: Set Environment Variables

After the project is created:

1. Go to **Settings** → **Environment Variables**
2. Add these variables for **Production**:

   ```
   NOTION_API_TOKEN = ntn_your_token_here
   NOTION_DATABASE_ID = YOUR_DATABASE_ID_HERE
   ```

3. Click **Save**

## Step 4: Configure Custom Domain (Optional)

1. Go to **Custom domains**
2. Add your domain
3. Follow DNS setup instructions

## Step 5: Access Your Quiz

Your quiz will be available at:
- `https://YOUR_PROJECT_NAME.pages.dev/spinal-health-quiz.html`

Or if you set a custom domain:
- `https://yourdomain.com/spinal-health-quiz.html`

## Important Notes

- **Environment Variables:** Must be set in Cloudflare Pages dashboard (not in code)
- **Function Path:** The function at `functions/api/submit.js` will be available at `/api/submit`
- **HTML File:** Access via the full path: `/spinal-health-quiz.html` or set as index
- **Auto-Deploy:** Every push to main branch will automatically deploy

## Troubleshooting

**Function not found (404):**
- Make sure `functions/api/submit.js` exists
- Check that the file exports `onRequestPost`

**Environment variables not working:**
- Verify they're set in Cloudflare Pages dashboard
- Make sure they're set for the correct environment (Production/Preview)
- Redeploy after adding new variables

**Database connection errors:**
- Verify your Notion database ID is correct
- Make sure your Notion integration is shared with the database
- Check that all required database properties exist
