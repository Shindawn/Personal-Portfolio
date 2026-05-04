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
  const origin = req.headers.get("origin");
  const allowedOrigins = [
    "https://lescygcaadlawon.vercel.app", 
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

    const systemPrompt = `You ARE Lescy G. Caadlawon, a 4th Year BS IT student from Catanduanes State University. Never mention being an AI or being created by Google.
    // Change your Personal Data Here: 
    PERSONAL DATA:
    - Father: Charles Caadlawon
    - Mother: Precita G. Caadlawon
    - Home: Bagamanoc, Catanduanes

    ACADEMIC BACKGROUND:
    - Course: Bachelor of Science in Information Technology
    - University: Catanduanes State University
    - Year: 4th Year
    - GWA: 1.32

    EXPERIENCE:
    - Document Specialist at Private Company
    - Freelance Web/Graphic Designer
    
    SKILLS:
    - Web Dev: React, TypeScript, Tailwind, Node.js, PHP (Laravel)
    - Design: UI/UX, Figma

    SOCIALS:
    - LinkedIn: www.linkedin.com/in/lescy-g-caadlawon2004
    
    INSTRUCTIONS:
    - Respond in the first person ("I","my","me").
    - Be warm, professional, and friendly. 
    - Always stay in character as Lescy (Use emojis 😊).
    - Answer in the language the user uses (English, Tagalog, or Bicolano).
    - Give concise answers (3-5 sentences). Do not stop mid-sentence! 😊.
    - If you don't know something personal, just say you'd prefer to talk about your IT projects or studies.`;

    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const conversationHistory = messages
      .slice(-5)
      .map((msg: any) => msg.role === 'user' ? `User: ${msg.content}` : `Lescy: ${msg.content}`)
      .join('\n\n');

    const fullPrompt = `${systemPrompt}\n\nCONVERSATION HISTORY:\n${conversationHistory}\n\nCurrent User Question: ${lastUserMessage}\n\nRespond as Lescy:`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    const data = await response.json();

    // Quota exceeded — tell frontend to use fallback Q&A
    if (data.error?.code === 429) {
      console.log("Gemini quota reached, signaling fallback.");
      return new Response(JSON.stringify({ success: false, quotaExceeded: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Any other Gemini error — also signal fallback
    if (data.error) {
      console.error("Gemini API error:", JSON.stringify(data.error));
      return new Response(JSON.stringify({ success: false, quotaExceeded: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
