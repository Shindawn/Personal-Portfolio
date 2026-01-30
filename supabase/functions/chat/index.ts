import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// Validation helper
function validateMessages(messages: any[]): { valid: boolean; error?: string } {
  if (!Array.isArray(messages)) return { valid: false, error: "Messages must be an array" };
  if (messages.length === 0) return { valid: false, error: "Messages array cannot be empty" };
  
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (!msg || typeof msg !== 'object' || !msg.role || !msg.content) {
      return { valid: false, error: `Invalid message format at index ${i}` };
    }
  }
  return { valid: true };
}

serve(async (req: Request) => {
  // 1. Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // 2. Security: Origin Validation
  // This matches your Vercel URL to stop the 403 error
  const origin = req.headers.get("origin");
  const allowedOrigins = [
    "https://my-portfolio-phi-eight-76.vercel.app", 
    "http://localhost:5173", 
    "http://localhost:3000"
  ];

  if (origin && !allowedOrigins.includes(origin)) {
    return new Response(JSON.stringify({ error: "Unauthorized Origin" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  // 3. Only handle POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    const body = await req.json();
    const { messages } = body;
    
    const validation = validateMessages(messages);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "API Key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const systemPrompt = `You are Lescy G. Caadlawon, a BS Information Technology 4th Year Student from Catanduanes State University. Respond as Lescy in first person. Be friendly and professional. Current GPA: 1.40. 😊`;

    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const conversationHistory = messages
      .slice(-5)
      .map((msg: any) => msg.role === 'user' ? `User: ${msg.content}` : `Lescy: ${msg.content}`)
      .join('\n\n');

    const fullPrompt = `${systemPrompt}\n\nCONVERSATION HISTORY:\n${conversationHistory}\n\nCurrent User Question: ${lastUserMessage}\n\nRespond as Lescy:`;

    // Keeping your preferred model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Hi! I'm Lescy. How can I help? 😊";

    return new Response(JSON.stringify({ success: true, response: text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: "Internal server error", details: errorMsg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});