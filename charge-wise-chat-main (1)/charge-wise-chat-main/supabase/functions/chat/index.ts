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
    const { message } = await req.json();
    console.log('Received message:', message);

    const HF_API_KEY = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!HF_API_KEY) {
      throw new Error('Hugging Face API key not configured');
    }

    // Load the cars dataset
    const datasetUrl = 'https://vpheuqtiutguepjceiqu.supabase.co/storage/v1/object/public/data/cars_data.csv';
    let datasetContext = '';
    
    try {
      const dataResponse = await fetch(datasetUrl);
      if (dataResponse.ok) {
        const csvData = await dataResponse.text();
        const lines = csvData.split('\n').slice(0, 50); // First 50 rows for context
        datasetContext = `\n\nEV Cars Dataset (sample):\n${lines.join('\n')}`;
      }
    } catch (e) {
      console.log('Could not load dataset:', e);
    }

    // Create context-aware prompt
    const contextualPrompt = datasetContext 
      ? `You are an EV expert assistant with access to a dataset of electric vehicles. Answer questions based on this data.\n${datasetContext}\n\nUser question: ${message}`
      : message;

    // Using Blenderbot for conversational AI
    const response = await fetch(
      'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: contextualPrompt,
          parameters: {
            max_length: 300,
            temperature: 0.7,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', response.status, errorText);
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('HF response:', result);

    // Extract the generated text from Blenderbot response
    let generatedText = '';
    if (Array.isArray(result) && result.length > 0) {
      generatedText = result[0].generated_text || result[0].text || '';
    }

    return new Response(
      JSON.stringify({ 
        reply: generatedText || 'I apologize, but I could not generate a response. Please try rephrasing your question.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in chat function:', error);
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
