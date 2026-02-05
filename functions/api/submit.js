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
  const GHL_LOCATION_ID = env.GHL_LOCATION_ID;
  const GHL_API_KEY = env.GHL_API_KEY;
  
  // Log for debugging (remove in production if sensitive)
  console.log('Environment check:', {
    hasNotionToken: !!NOTION_API_TOKEN,
    hasNotionDbId: !!NOTION_DATABASE_ID,
    hasGhlLocationId: !!GHL_LOCATION_ID,
    hasGhlApiKey: !!GHL_API_KEY
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
    const { name, email, phone, answers, questions } = data;
    
    // Validate required data
    if (!name || !email || !answers || !questions) {
      console.error('Missing required data:', { hasName: !!name, hasEmail: !!email, hasAnswers: !!answers, hasQuestions: !!questions });
      return new Response(
        JSON.stringify({ error: 'Missing required data: name, email, answers, or questions' }),
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }
    
    console.log('Processing submission for:', name, email, phone || 'no phone');
    
    // Calculate results
    const totalScore = answers.reduce((sum, val) => sum + val, 0);
    const maxScore = questions.length * 3;
    const percentage = Math.round((totalScore / maxScore) * 100);
    
    let severity, description, title, recommendation;
    if (percentage <= 25) {
      severity = "Excellent";
      title = "Great News!";
      description = "Your spinal health appears to be in excellent condition. You're experiencing minimal to no discomfort, which suggests good posture habits and spinal care. Continue maintaining your current lifestyle and preventive practices.";
      recommendation = "Keep up your healthy habits and consider regular check-ups to maintain optimal spinal health.";
    } else if (percentage <= 50) {
      severity = "Moderate";
      title = "Time for Attention";
      description = "You're experiencing some spinal discomfort that warrants attention. While not severe, these symptoms suggest your spine could benefit from targeted care and lifestyle adjustments to prevent progression.";
      recommendation = "We recommend consulting with a spinal health specialist to develop a personalized care plan.";
    } else {
      severity = "Significant";
      title = "Immediate Action Recommended";
      description = "Your responses indicate significant spinal health challenges that are affecting your daily life. These symptoms suggest you could greatly benefit from professional evaluation and comprehensive treatment.";
      recommendation = "We strongly recommend scheduling a consultation with our spinal health experts as soon as possible.";
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
      "Name": {
        "title": [
          {
            "text": {
              "content": name
            }
          }
        ]
      },
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
      "Severity Level": {
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
    
    // Submit to GoHighLevel (non-blocking - don't fail if this fails)
    let ghlSuccess = false;
    let ghlError = null;
    
    console.log('GHL Check:', {
      hasLocationId: !!GHL_LOCATION_ID,
      hasApiKey: !!GHL_API_KEY,
      locationIdValue: GHL_LOCATION_ID ? '***' : 'missing',
      apiKeyValue: GHL_API_KEY ? '***' : 'missing'
    });
    
    if (GHL_LOCATION_ID && GHL_API_KEY) {
      try {
        // Split name into first and last name
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0] || name;
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Prepare GHL contact data
        const ghlContactData = {
          locationId: GHL_LOCATION_ID,
          firstName: firstName,
          lastName: lastName,
          email: email,
          tags: ['Spinal Health Quiz'],
          customFields: [
            {
              name: 'TotalScore',
              value: totalScore.toString()
            },
            {
              name: 'MaxScore',
              value: maxScore.toString()
            },
            {
              name: 'ScorePercentage',
              value: percentage.toString()
            },
            {
              name: 'SeverityLevel',
              value: severity
            },
            {
              name: 'ResultsTitle',
              value: title
            },
            {
              name: 'ResultsDescription',
              value: description
            },
            {
              name: 'Recommendation',
              value: recommendation
            }
          ]
        };
        
        // Add phone if provided
        if (phone && phone.trim() !== '') {
          // Clean phone number (remove non-digits, then format)
          const cleanedPhone = phone.replace(/\D/g, '');
          if (cleanedPhone.length >= 10) {
            ghlContactData.phone = cleanedPhone;
          }
        }
        
        console.log('Submitting to GoHighLevel:', { locationId: GHL_LOCATION_ID, name, email, hasPhone: !!ghlContactData.phone });
        
        const ghlResponse = await fetch('https://services.leadconnectorhq.com/contacts/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GHL_API_KEY}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28'
          },
          body: JSON.stringify(ghlContactData)
        });
        
        if (ghlResponse.ok) {
          const ghlResult = await ghlResponse.json();
          console.log('Successfully created GHL contact:', ghlResult.contact?.id);
          ghlSuccess = true;
        } else {
          const errorText = await ghlResponse.text();
          let ghlErrorData;
          try {
            ghlErrorData = JSON.parse(errorText);
          } catch (e) {
            ghlErrorData = { message: errorText, status: ghlResponse.status };
          }
          console.error('GoHighLevel API error:', {
            status: ghlResponse.status,
            statusText: ghlResponse.statusText,
            error: ghlErrorData
          });
          ghlError = ghlErrorData.message || ghlErrorData.error || `HTTP ${ghlResponse.status}`;
        }
      } catch (ghlErr) {
        console.error('Error submitting to GoHighLevel:', {
          message: ghlErr.message,
          stack: ghlErr.stack
        });
        ghlError = ghlErr.message;
        // Don't throw - continue even if GHL fails
      }
    } else {
      console.log('GoHighLevel credentials not configured, skipping GHL submission');
      ghlError = 'GHL credentials not found in environment variables';
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        pageId: result.id,
        ghlSuccess: ghlSuccess,
        ghlError: ghlError
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
