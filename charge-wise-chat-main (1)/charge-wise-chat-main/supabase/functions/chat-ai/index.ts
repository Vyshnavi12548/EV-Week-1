import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, datasetContext } = await req.json();
    console.log('Received message:', message);
    console.log('Dataset context provided:', !!datasetContext);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('Lovable API key not configured');
    }

    // Build system prompt with dataset context
    let systemPrompt = 'You are an expert EV (Electric Vehicle) data analyst assistant. You help users understand and analyze their EV datasets.';
    
    if (datasetContext) {
      systemPrompt += `\n\nThe user has uploaded an EV dataset. Here is a sample of the data:\n\n${datasetContext}\n\nUse this data to answer questions accurately. Provide specific insights, statistics, and recommendations based on the actual data shown above.`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded. Please try again in a moment.',
            reply: 'I apologize, but I\'m experiencing high demand. Please try again in a moment.'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 429,
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: 'Payment required. Please add credits to your workspace.',
            reply: 'Service unavailable. Please contact support.'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 402,
          }
        );
      }
      
      throw new Error(`Lovable AI API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('AI response received');

    const reply = result.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response.';

    return new Response(
      JSON.stringify({ reply }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in chat-ai function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred processing your request';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        reply: 'I encountered an error. Please try again or rephrase your question.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
