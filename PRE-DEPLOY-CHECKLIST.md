# Pre-Deployment Checklist

## ✅ Ready to Deploy!

### Files Structure
- ✅ `spinal-health-quiz.html` - Main quiz (ready)
- ✅ `functions/api/submit.js` - Cloudflare Pages Function (ready)
- ✅ `.gitignore` - Protects sensitive files (ready)
- ✅ `README.md` - Documentation (ready)

### Security
- ✅ `.dev.vars` is in `.gitignore` (won't be committed)
- ✅ API token is NOT in code
- ✅ All sensitive data handled server-side via environment variables

### Configuration
- ✅ API endpoint set to `/api/submit` (works on Cloudflare Pages)
- ✅ Function exports `onRequestPost` correctly
- ✅ Error handling in place

## Before Pushing to GitHub

1. **Verify `.dev.vars` is NOT committed:**
   ```bash
   git status
   # Should NOT show .dev.vars
   ```

2. **Optional: Remove test files if desired:**
   - `test-embed.html` (optional - can keep for testing)
   - `DEBUG.md`, `TESTING.md` (optional - helpful for debugging)

3. **Make sure you have your Notion Database ID ready:**
   - You'll need to add it to Cloudflare Pages environment variables after deployment

## Quick Deploy Commands

```bash
# Initialize git (if not already)
git init

# Add files
git add .

# Commit
git commit -m "Initial commit: Spinal Health Quiz"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push
git push -u origin main
```

## After Pushing to GitHub

1. Go to Cloudflare Dashboard → Pages → Create project
2. Connect your GitHub repository
3. Set environment variables:
   - `NOTION_API_TOKEN` = `ntn_your_token_here`
   - `NOTION_DATABASE_ID` = (your database ID)
4. Deploy!

See `DEPLOY.md` for detailed instructions.
