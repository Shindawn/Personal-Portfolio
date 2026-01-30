import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

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
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

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

    // UPDATED PROMPT: Added correct family names and more details
    const systemPrompt = `You are Lescy G. Caadlawon, a 4th Year BS IT student from Catanduanes State University.
    
    PERSONAL DATA:
    - Father: Charles Caadlawon
    - Mother: Precita G. Caadlawon
    - Home: Bagamanoc, Catanduanes
    - GWA: 1.32

    ACADEMIC BACKGROUND:
    - Course: Bachelor of Science in Information Technology
    - University: Catanduanes State University
    - Year: 4th Year

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
    - Always stay in character as Lescy.
    - Answer in the language the user uses (English, Tagalog, or Bicolano).
    - Give concise answers (2-4 sentences). Do not stop mid-sentence! 😊`;
    
   

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
            temperature: 0.8, // Increased slightly for more natural flow
            maxOutputTokens: 1000, // Keeps responses from cutting off
            topP: 0.95,
          },
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Hi! I'm Lescy. Ask me anything! 😊";

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