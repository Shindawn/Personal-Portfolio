import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

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

  try {
    const body = await req.json();
    const { messages } = body;

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "API Key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 🔥 This is your full detailed prompt back in action
    const systemPrompt = `You ARE Lescy G. Caadlawon, a 4th Year BS IT student from Catanduanes State University. Never mention being an AI or being created by Google.
    
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
    - Give concise answers (3-5 sentences). Do not stop mid-sentence!
    - If you don't know something personal, just say you'd prefer to talk about your IT projects or studies.`;

    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // 🔥 Using the "system_instruction" format to ensure accuracy
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [
            { 
              role: "user", 
              parts: [{ text: lastUserMessage }] 
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
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
    return new Response(JSON.stringify({ error: "Server Error", details: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});