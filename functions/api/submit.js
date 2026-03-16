/**
 * Cloudflare Pages Function to submit quiz results to Notion
 * This keeps the API token secure on the server side
 */

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json'
};

// Handle OPTIONS preflight requests
export async function onRequestOptions() {
  return new Response(null, { 
    status: 204,
    headers: corsHeaders
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  
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
    const { name, email, phone, answers, questions, newsletter, schedule_me, note, consent_emails, consent_schedule, intent, gclid } = data;
    
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

    // Optional Notion properties – resolve consent flags (used for GHL gating too)
    const newsletterChecked = newsletter !== undefined ? !!newsletter : (consent_emails !== undefined ? !!consent_emails : undefined);
    const scheduleMeChecked = schedule_me !== undefined ? !!schedule_me : (consent_schedule !== undefined ? !!consent_schedule : undefined);

    // Prepare Notion page properties – lead info and consent only (no quiz/score/severity for compliance)
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
      }
    };

    // Phone – Notion "Phone" property (phone_number type)
    if (phone && typeof phone === 'string' && phone.trim() !== '') {
      properties["Phone"] = { "phone_number": phone.trim() };
    }

    // Optional Notion properties – only add if your Notion DB has these columns (exact names).
    const optionalProperties = {};
    if (newsletterChecked !== undefined) {
      optionalProperties["Newsletter"] = { "checkbox": newsletterChecked };
    }
    if (scheduleMeChecked !== undefined) {
      optionalProperties["Schedule Me"] = { "checkbox": scheduleMeChecked };
    }
    if (note && typeof note === 'string' && note.trim() !== '') {
      optionalProperties["Note"] = {
        "rich_text": [
          { "type": "text", "text": { "content": note.trim() } }
        ]
      };
    }
    if (intent === 'book_appointment') {
      optionalProperties["Requested Booking"] = { "checkbox": true };
    }
    if (gclid && typeof gclid === 'string' && gclid.trim() !== '') {
      optionalProperties["GCLID"] = {
        "rich_text": [
          { "type": "text", "text": { "content": gclid.trim() } }
        ]
      };
    }
    Object.assign(properties, optionalProperties);

    // No quiz/score/answers stored in Notion page body (compliance)
    const children = [];

    const createNotionPage = async (props) => {
      const res = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify({
          parent: { database_id: NOTION_DATABASE_ID },
          properties: props,
          children: children
        })
      });
      return res;
    };
    
    // Create the page with properties and children
    let notionResponse = await createNotionPage(properties);

    // If Notion returns 400 (e.g. Newsletter/Schedule Me/Note don't exist in DB), retry without optional props
    if (!notionResponse.ok && notionResponse.status === 400 && Object.keys(optionalProperties).length > 0) {
      const errorData = await notionResponse.json().catch(() => ({}));
      const msg = (errorData.message || '').toLowerCase();
      if (msg.includes('property') || msg.includes('validation') || (errorData.code === 'validation_error')) {
        console.warn('Notion rejected optional properties (Newsletter/Schedule Me/Note?). Retrying without them.', errorData.message);
        const propsWithoutOptional = { ...properties };
        Object.keys(optionalProperties).forEach(key => delete propsWithoutOptional[key]);
        notionResponse = await createNotionPage(propsWithoutOptional);
      } else {
        return new Response(
          JSON.stringify({ error: 'Failed to submit to Notion', details: errorData, status: notionResponse.status }),
          { status: notionResponse.status, headers: corsHeaders }
        );
      }
    }

    if (!notionResponse.ok) {
      const errorData = await notionResponse.json().catch(() => ({}));
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

    // GoHighLevel: only send lead info (name, email, phone), and only if user gave permission or requested booking (compliance)
    let ghlSuccess = false;
    let ghlError = null;
    const sendToGhl = (newsletterChecked || scheduleMeChecked || intent === 'book_appointment');

    if (GHL_LOCATION_ID && GHL_API_KEY && sendToGhl) {
      try {
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0] || name;
        const lastName = nameParts.slice(1).join(' ') || '';

        const ghlContactData = {
          locationId: GHL_LOCATION_ID,
          firstName: firstName,
          lastName: lastName,
          email: email,
          tags: ['Spinal Health Quiz']
        };

        if (phone && phone.trim() !== '') {
          const cleanedPhone = phone.replace(/\D/g, '');
          if (cleanedPhone.length >= 10) {
            ghlContactData.phone = cleanedPhone;
          }
        }

        console.log('Submitting lead to GoHighLevel (no result data):', { locationId: GHL_LOCATION_ID, name, email, hasPhone: !!ghlContactData.phone });

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
          console.error('GoHighLevel API error:', { status: ghlResponse.status, error: ghlErrorData });
          ghlError = ghlErrorData.message || ghlErrorData.error || `HTTP ${ghlResponse.status}`;
        }
      } catch (ghlErr) {
        console.error('Error submitting to GoHighLevel:', ghlErr.message);
        ghlError = ghlErr.message;
      }
    } else if (!sendToGhl) {
      console.log('Skipping GHL: no consent or booking request');
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
