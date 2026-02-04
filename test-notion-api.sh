#!/bin/bash
# Test script to verify Notion API formatting
# Run this to test if the formatting works before deploying

# Set these variables before running:
# NOTION_API_TOKEN="your_token_here"
# NOTION_DATABASE_ID="your_database_id_here"

# Test payload with the exact format from our function
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
        "type": "heading_1",
        "heading_1": {
          "rich_text": [{"type": "text", "text": {"content": "Assessment Results"}}]
        }
      },
      {
        "object": "block",
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {"type": "text", "text": {"content": "Score: "}},
            {"type": "text", "text": {"content": "10 out of 30"}, "annotations": {"bold": true}},
            {"type": "text", "text": {"content": " (33%)"}}
          ]
        }
      },
      {
        "object": "block",
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {"type": "text", "text": {"content": "Severity Level: "}},
            {"type": "text", "text": {"content": "Moderate"}, "annotations": {"bold": true}}
          ]
        }
      },
      {
        "object": "block",
        "type": "divider",
        "divider": {}
      },
      {
        "object": "block",
        "type": "heading_2",
        "heading_2": {
          "rich_text": [{"type": "text", "text": {"content": "Time for Attention"}}]
        }
      },
      {
        "object": "block",
        "type": "paragraph",
        "paragraph": {
          "rich_text": [{"type": "text", "text": {"content": "Test description"}}]
        }
      },
      {
        "object": "block",
        "type": "heading_2",
        "heading_2": {
          "rich_text": [{"type": "text", "text": {"content": "Quiz Answers"}}]
        }
      },
      {
        "object": "block",
        "type": "heading_3",
        "heading_3": {
          "rich_text": [{"type": "text", "text": {"content": "Question 1: Test question?"}}]
        }
      },
      {
        "object": "block",
        "type": "bulleted_list_item",
        "bulleted_list_item": {
          "rich_text": [
            {"type": "text", "text": {"content": "Answer: "}},
            {"type": "text", "text": {"content": "Test answer"}, "annotations": {"bold": true}},
            {"type": "text", "text": {"content": " (Score: 1/3)"}}
          ]
        }
      }
    ]
  }'
