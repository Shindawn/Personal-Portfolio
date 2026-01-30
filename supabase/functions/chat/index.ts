import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// Validation helper
function validateMessages(messages: any[]): { valid: boolean; error?: string } {
  if (!Array.isArray(messages)) {
    return { valid: false, error: "Messages must be an array" };
  }
  
  if (messages.length === 0) {
    return { valid: false, error: "Messages array cannot be empty" };
  }
  
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (!msg || typeof msg !== 'object') {
      return { valid: false, error: `Message at index ${i} is not an object` };
    }
    if (!msg.role || !['user', 'assistant'].includes(msg.role)) {
      return { valid: false, error: `Message at index ${i} must have a valid role (user/assistant)` };
    }
    if (!msg.content || typeof msg.content !== 'string') {
      return { valid: false, error: `Message at index ${i} must have a string content` };
    }
  }
  
  return { valid: true };
}

serve(async (req: Request) => {  // ✅ FIXED: Added type annotation
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only handle POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    const body = await req.json();
    const { messages } = body;
    
    // Validate messages
    const validation = validateMessages(messages);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Get API key
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not configured");
      return new Response(JSON.stringify({ 
        error: "Server configuration error: GEMINI_API_KEY not set" 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const systemPrompt = `You are Lescy G. Caadlawon, a BS Information Technology 4th Year Student from Catanduanes State University, located in Bagamanoc, Catanduanes, Philippines. Current GPA: 1.40.

ABOUT ME:
- 4th year BS Information Technology student  
- Passionate about web development and UI/UX design
- From Bagamanoc, Catanduanes, Philippines
- Studying at Catanduanes State University

TECHNICAL SKILLS:
- Frontend: React, TypeScript, Tailwind CSS, HTML, CSS, JavaScript
- Backend: Node.js, Python, PHP, Laravel
- Database: Firebase, MySQL
- Design: UI/UX, Figma, Canva, Adobe Suite (Photoshop, Illustrator)
- Tools: Git, GitHub

CURRENT STATUS:
- Actively seeking internship/OJT opportunities
- Open to web development and UI/UX design roles
- Available for full-stack development positions

CONTACT:
- Email: caadlawony@gmail.com

IMPORTANT INSTRUCTIONS:
- Respond as Lescy in first person (use "I", "my", "me")
- Be friendly, professional, and conversational
- Keep answers concise but informative (2-4 sentences)
- Answer in the same language as the user (English, Tagalog, Bicolano, etc.)
- Use occasional emojis to appear more approachable 😊
- Always stay in character as Lescy`;

    // Optional project summary from environment (keep it short)
    const PROJECTS_SUMMARY = Deno.env.get("PROJECTS_SUMMARY") || "";

    // Get last user message
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    
    // Build conversation context from message history
    const conversationHistory = messages
      .slice(-5)
      .map((msg: any) => 
        msg.role === 'user' ? `User: ${msg.content}` : `Lescy: ${msg.content}`
      )
      .join('\n\n');

    const projectsSection = PROJECTS_SUMMARY ? `\n\nPROJECTS:\n${PROJECTS_SUMMARY}` : '';

    const fullPrompt = `${systemPrompt}${projectsSection}\n\nCONVERSATION HISTORY:\n${conversationHistory}\n\nCurrent User Question: ${lastUserMessage}\n\nRespond as Lescy in a natural, conversational way:`;

    // ✅ Updated to gemini-2.5-flash (stable, current model - non-deprecated)
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
            topP: 0.95,
            topK: 40,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      
      return new Response(JSON.stringify({ 
        error: "Failed to get response from AI service",
        details: `Gemini API returned ${response.status}`
      }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                 "Hi! I'm Lescy, a BS IT student from Catanduanes. Ask me about my skills or projects! 😊";

    return new Response(JSON.stringify({ 
      success: true,
      response: text 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    
    // ✅ FIXED: Cast error to Error type
    const errorMsg = error instanceof Error ? error.message : String(error);
    
    return new Response(JSON.stringify({ 
      error: "Internal server error",
      details: errorMsg
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});