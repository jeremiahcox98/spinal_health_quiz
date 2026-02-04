/**
 * Cloudflare Pages Function to submit quiz results to Notion
 * This keeps the API token secure on the server side
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  
  // Add CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Get environment variables
  const NOTION_API_TOKEN = env.NOTION_API_TOKEN;
  const NOTION_DATABASE_ID = env.NOTION_DATABASE_ID;
  
  // Log for debugging (remove in production if sensitive)
  console.log('Environment check:', {
    hasToken: !!NOTION_API_TOKEN,
    hasDbId: !!NOTION_DATABASE_ID,
    dbIdLength: NOTION_DATABASE_ID?.length
  });
  
  // Validate environment variables
  if (!NOTION_API_TOKEN || !NOTION_DATABASE_ID) {
    console.error('Missing environment variables:', {
      hasToken: !!NOTION_API_TOKEN,
      hasDbId: !!NOTION_DATABASE_ID
    });
    return new Response(
      JSON.stringify({ 
        error: 'Server configuration error: Missing Notion credentials',
        details: {
          hasToken: !!NOTION_API_TOKEN,
          hasDbId: !!NOTION_DATABASE_ID
        }
      }),
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
  
  try {
    // Parse request body
    const data = await request.json();
    const { email, answers, questions } = data;
    
    // Validate required data
    if (!email || !answers || !questions) {
      console.error('Missing required data:', { hasEmail: !!email, hasAnswers: !!answers, hasQuestions: !!questions });
      return new Response(
        JSON.stringify({ error: 'Missing required data: email, answers, or questions' }),
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }
    
    console.log('Processing submission for:', email);
    
    // Calculate results
    const totalScore = answers.reduce((sum, val) => sum + val, 0);
    const maxScore = questions.length * 3;
    const percentage = Math.round((totalScore / maxScore) * 100);
    
    let severity, description, title;
    if (percentage <= 25) {
      severity = "Excellent";
      title = "Great News!";
      description = "Your spinal health appears to be in excellent condition. You're experiencing minimal to no discomfort, which suggests good posture habits and spinal care. Continue maintaining your current lifestyle and preventive practices.";
    } else if (percentage <= 50) {
      severity = "Moderate";
      title = "Time for Attention";
      description = "You're experiencing some spinal discomfort that warrants attention. While not severe, these symptoms suggest your spine could benefit from targeted care and lifestyle adjustments to prevent progression.";
    } else {
      severity = "Significant";
      title = "Immediate Action Recommended";
      description = "Your responses indicate significant spinal health challenges that are affecting your daily life. These symptoms suggest you could greatly benefit from professional evaluation and comprehensive treatment.";
    }
    
    // Prepare quiz answers data
    const quizAnswers = questions.map((q, index) => {
      const answerValue = answers[index];
      const selectedAnswer = q.answers.find(a => a.value === answerValue);
      return {
        question: q.question,
        answer: selectedAnswer ? selectedAnswer.text : 'Not answered',
        score: answerValue
      };
    });
    
    // Prepare Notion page properties
    const properties = {
      "Email": {
        "email": email
      },
      "Date/Time": {
        "date": {
          "start": new Date().toISOString()
        }
      },
      "Total Score": {
        "number": totalScore
      },
      "Score Percentage": {
        "number": percentage
      },
      "Severity Level ": {
        "select": {
          "name": severity
        }
      }
    };
    
    // Build children blocks for page content
    const children = [
      // Results Summary Section
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
            {"type": "text", "text": {"content": `${totalScore} out of ${maxScore}`}, "annotations": {"bold": true}},
            {"type": "text", "text": {"content": ` (${percentage}%)`}}
          ]
        }
      },
      {
        "object": "block",
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {"type": "text", "text": {"content": "Severity Level: "}},
            {"type": "text", "text": {"content": severity}, "annotations": {"bold": true}}
          ]
        }
      },
      {
        "object": "block",
        "type": "divider",
        "divider": {}
      },
      // Results Description
      {
        "object": "block",
        "type": "heading_2",
        "heading_2": {
          "rich_text": [{"type": "text", "text": {"content": title}}]
        }
      },
      {
        "object": "block",
        "type": "paragraph",
        "paragraph": {
          "rich_text": [{"type": "text", "text": {"content": description}}]
        }
      },
      {
        "object": "block",
        "type": "divider",
        "divider": {}
      },
      // Quiz Answers Section
      {
        "object": "block",
        "type": "heading_2",
        "heading_2": {
          "rich_text": [{"type": "text", "text": {"content": "Quiz Answers"}}]
        }
      }
    ];
    
    // Add each question and answer as blocks
    quizAnswers.forEach((qa, index) => {
      children.push({
        "object": "block",
        "type": "heading_3",
        "heading_3": {
          "rich_text": [{"type": "text", "text": {"content": `Question ${index + 1}: ${qa.question}`}}]
        }
      });
      children.push({
        "object": "block",
        "type": "bulleted_list_item",
        "bulleted_list_item": {
          "rich_text": [
            {"type": "text", "text": {"content": "Answer: "}},
            {"type": "text", "text": {"content": qa.answer}, "annotations": {"bold": true}},
            {"type": "text", "text": {"content": ` (Score: ${qa.score}/3)`}}
          ]
        }
      });
    });
    
    // Create the page with properties and children
    const notionResponse = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        parent: {
          database_id: NOTION_DATABASE_ID
        },
        properties: properties,
        children: children
      })
    });
    
    if (!notionResponse.ok) {
      const errorData = await notionResponse.json();
      console.error('Notion API error:', errorData);
      console.error('Notion API status:', notionResponse.status);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to submit to Notion',
          details: errorData,
          status: notionResponse.status
        }),
        { 
          status: notionResponse.status,
          headers: corsHeaders
        }
      );
    }
    
    const result = await notionResponse.json();
    console.log('Successfully created Notion page:', result.id);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        pageId: result.id
      }),
      { 
        status: 200,
        headers: corsHeaders
      }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        stack: error.stack
      }),
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}
