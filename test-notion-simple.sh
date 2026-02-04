#!/bin/bash
# Simple test to verify Notion API formatting works

# Set these variables before running:
# NOTION_API_TOKEN="your_token_here"
# NOTION_DATABASE_ID="your_database_id_here"

echo "Testing Notion API with corrected formatting..."
echo ""

curl -X POST https://api.notion.com/v1/pages \
  -H "Authorization: Bearer ${NOTION_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -H "Notion-Version: 2022-06-28" \
  -d '{
    "parent": {
      "database_id": "'${NOTION_DATABASE_ID}'"
    },
    "properties": {
      "Email": {
        "email": "test@example.com"
      },
      "Date/Time": {
        "date": {
          "start": "2026-02-04T19:00:00.000Z"
        }
      },
      "Total Score": {
        "number": 10
      },
      "Score Percentage": {
        "number": 33
      },
      "Severity Level": {
        "select": {
          "name": "Moderate"
        }
      }
    },
    "children": [
      {
        "object": "block",
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {"type": "text", "text": {"content": "Test: "}},
            {"type": "text", "text": {"content": "Bold text"}, "annotations": {"bold": true}}
          ]
        }
      }
    ]
  }' | jq '.'

echo ""
echo "If you see a page object with an 'id' field, the formatting is correct!"
echo "If you see an error, check the error message for details."
