# Spinal Health Quiz - Cloudflare Pages Setup

This quiz is designed to be hosted on Cloudflare Pages with serverless functions to securely handle Notion API integration.

## Prerequisites

1. A Cloudflare account
2. A Notion account with:
   - A Notion integration created at https://www.notion.so/my-integrations
   - A database with the required properties (see below)

## Setup Instructions

### 1. Notion Database Setup

Create a database in Notion with the following properties:

- **Email** (Email type)
- **Date/Time** (Date type)
- **Total Score** (Number type)
- **Score Percentage** (Number type)
- **Severity Level** (Select type with options: `Excellent`, `Moderate`, `Significant`)

### 2. Get Your Notion Credentials

1. Go to https://www.notion.so/my-integrations
2. Create a new integration or use an existing one
3. Copy the **Internal Integration Token** (starts with `ntn_`)
4. Open your Notion database
5. Click the "..." menu in the top right → "Add connections" → Select your integration
6. Get your database ID from the URL:
   - URL format: `https://www.notion.so/workspace/DATABASE_ID?v=...`
   - The database ID is the 32-character string (remove any hyphens)

### 3. Deploy to Cloudflare Pages

#### Option A: Using Wrangler CLI (Recommended)

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Set environment variables:
   ```bash
   wrangler pages secret put NOTION_API_TOKEN
   # Paste your Notion API token when prompted
   
   wrangler pages secret put NOTION_DATABASE_ID
   # Paste your Notion database ID when prompted
   ```

4. Deploy:
   ```bash
   wrangler pages deploy .
   ```

#### Option B: Using Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → **Create a project**
3. Connect your Git repository or upload the files
4. Go to **Settings** → **Environment Variables**
5. Add the following secrets:
   - `NOTION_API_TOKEN` = Your Notion integration token
   - `NOTION_DATABASE_ID` = Your Notion database ID
6. Save and redeploy

### 4. Project Structure

```
spinal-health-quiz/
├── spinal-health-quiz.html    # Main quiz HTML file
├── functions/
│   └── api/
│       └── submit.js          # Cloudflare Pages Function for Notion API
└── README.md                   # This file
```

## Environment Variables

**For Local Development:**
- Create a `.dev.vars` file (copy from `.dev.vars.example`)
- Add your `NOTION_API_TOKEN` and `NOTION_DATABASE_ID`

**For Production (Cloudflare Pages):**
- Set these as environment variables in Cloudflare Pages dashboard
- Go to Settings → Environment Variables → Add variable
- Or use `wrangler pages secret put VARIABLE_NAME`

Required variables:
- `NOTION_API_TOKEN` - Your Notion integration token (starts with `ntn_`)
- `NOTION_DATABASE_ID` - Your Notion database ID (32-character string)

## Local Development

For local development, create a `.dev.vars` file (this is Cloudflare's equivalent of `.env`):

1. Copy `.dev.vars.example` to `.dev.vars`:
   ```bash
   cp .dev.vars.example .dev.vars
   ```

2. Edit `.dev.vars` and add your actual values:
   ```
   NOTION_API_TOKEN=ntn_your_token_here
   NOTION_DATABASE_ID=your_database_id_here
   ```

3. Run the local development server:
   ```bash
   wrangler pages dev . --compatibility-date=2024-01-01
   ```

The `.dev.vars` file is automatically loaded by Wrangler and is already in `.gitignore`, so it won't be committed to git.

## Security Notes

- ✅ API tokens are stored securely as Cloudflare Pages secrets
- ✅ API tokens are never exposed to the client-side code
- ✅ All Notion API calls are made server-side through Cloudflare Functions

## Troubleshooting

### Function not found (404)
- Ensure the function is in `functions/api/submit.js`
- Check that the file exports `onRequestPost`

### Environment variables not working
- Verify secrets are set in Cloudflare Pages dashboard
- For local development, use `.dev.vars` file
- Redeploy after adding new environment variables

### Notion API errors
- Verify your integration token is correct
- Ensure your database is shared with the integration
- Check that all required database properties exist with correct types
- Verify property names match exactly (case-sensitive)

## Support

If you encounter issues:
1. Check the browser console for client-side errors
2. Check Cloudflare Pages function logs in the dashboard
3. Verify your Notion integration has access to the database
