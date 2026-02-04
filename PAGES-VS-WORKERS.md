# Cloudflare Pages vs Workers - Quick Guide

## The Difference

**Cloudflare Pages:**
- ✅ For static websites (HTML, CSS, JS)
- ✅ Automatically serves your HTML files
- ✅ Supports serverless functions in `functions/` directory
- ✅ URL format: `your-project.pages.dev`
- ✅ Perfect for this quiz project

**Cloudflare Workers:**
- ❌ For API endpoints and serverless functions only
- ❌ Doesn't serve static HTML files easily
- ❌ Different URL format
- ❌ Not suitable for this project

## If You Created a Worker by Mistake

### Option 1: Create a New Pages Project (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** (not Workers)
3. Click **Create a project**
4. Click **Connect to Git**
5. Select your GitHub repository: `spinal_health_quiz`
6. Configure:
   - **Project name:** `spinal-health-quiz` (or any name you like)
   - **Framework preset:** None
   - **Build command:** `echo "No build needed"`
   - **Deploy command:** (leave empty)
   - **Build output directory:** (leave empty)
   - **Root directory:** `/`
7. Click **Save and Deploy**
8. After deployment, you'll see your URL: `https://spinal-health-quiz.pages.dev`

### Option 2: Find Your Pages Project

If you already created a Pages project but can't find the URL:

1. Go to **Pages** in Cloudflare Dashboard
2. Click on your project name
3. The URL is shown at the top: `https://YOUR-PROJECT-NAME.pages.dev`
4. Your quiz will be at: `https://YOUR-PROJECT-NAME.pages.dev/spinal-health-quiz.html`

## Setting Up Environment Variables

After creating the Pages project:

1. Go to **Settings** → **Environment Variables**
2. Add for **Production**:
   - `NOTION_API_TOKEN` = `ntn_your_token_here` (your actual token)
   - `NOTION_DATABASE_ID` = `2fdea7f8f24d80ae8468e64a3659ce98`
3. Click **Save**

## Accessing Your Quiz

Once deployed, your quiz will be available at:
- Main URL: `https://YOUR-PROJECT-NAME.pages.dev/spinal-health-quiz.html`
- API endpoint: `https://YOUR-PROJECT-NAME.pages.dev/api/submit`

## Quick Check

To verify you're in the right place:
- ✅ **Pages** section = Correct
- ❌ **Workers** section = Wrong (delete and create Pages project)
