# Cloudflare Pages Build Configuration Fix

## The Problem
Cloudflare Pages is trying to run `wrangler deploy` which is for Workers, not Pages. For Pages, we need to configure it correctly.

## Solution: Update Build Settings in Cloudflare Dashboard

1. Go to your Cloudflare Pages project
2. Navigate to **Settings** → **Builds & deployments**
3. Click **Edit configuration**

4. Update the build settings to:
   - **Framework preset:** `None` (or leave empty)
   - **Build command:** Use one of these options:
     - `echo "No build needed"` (recommended - does nothing)
     - `true` (also does nothing, just exits successfully)
     - Leave empty if possible
   - **Build output directory:** (leave empty)
   - **Root directory:** `/` (root of repository)
   
   **Note:** The build command field might be separate from deploy command. If there's a separate "Deploy command" field, you can use the same minimal commands above.

5. **Save** the configuration

6. Go to **Settings** → **Environment Variables** and add:
   - `NOTION_API_TOKEN` = `ntn_your_token_here` (your actual Notion API token)
   - `NOTION_DATABASE_ID` = `2fdea7f8f24d80ae8468e64a3659ce98`

7. Click **Retry deployment** or push a new commit to trigger a rebuild

## Alternative: Create a package.json (Optional)

If you want to be explicit, you can create a minimal `package.json`:

```json
{
  "name": "spinal-health-quiz",
  "version": "1.0.0",
  "private": true
}
```

But this isn't necessary - Cloudflare Pages will automatically detect and serve:
- Your HTML file
- Your `functions/` directory for serverless functions

## How It Works

Cloudflare Pages automatically:
- Serves static files (your HTML)
- Detects `functions/` directory and makes them available as API endpoints
- No build step needed for this project

## After Fixing

Once you update the build settings and remove the build command, your deployment should succeed. The quiz will be available at:
- `https://YOUR_PROJECT.pages.dev/spinal-health-quiz.html`
- API endpoint: `https://YOUR_PROJECT.pages.dev/api/submit`
