/**
 * geminiService.ts
 * * This service handles the communication between the portfolio frontend (Vercel)
 * and the AI logic (Supabase Edge Functions).
 */

import { sanitizeChatResponse } from "../lib/chatResponseGuard";

// 1. Check if Vercel has the necessary connection info
// We use the names you provided in your Vercel dashboard
const CHAT_FUNCTION_URL = import.meta.env.VITE_CHAT_FUNCTION_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

console.log("🤖 Chatbot Status:", {
  endpoint: CHAT_FUNCTION_URL ? "✅ Linked" : "❌ Missing VITE_CHAT_FUNCTION_URL",
  auth: SUPABASE_KEY ? "✅ Key Found" : "❌ Missing VITE_SUPABASE_PUBLISHABLE_KEY"
});

// Tracks whether we've already shown the quota notice this session
let quotaNoticeSent = false;

// Once quota is hit, skip the backend entirely for the rest of the session
let useLocalOnly = false;

// Fallback Q&A data for when API is unavailable
const fallbackQA = [
  {
    keywords: ["hi", "hello", "hey", "introduce", "kamusta"],
    answer: "Hi! I'm Lescy G. Caadlawon, a BS Information Technology graduate from Catanduanes State University. I'm passionate about web development and UI/UX design, and I'm currently looking for a job. How can I help you?"
  },
  {
    keywords: ["who are you", "sino ka", "about you", "tell me about"],
    answer: "I'm Lescy G. Caadlawon, a BS IT graduate from Catanduanes State University. I specialize in web development (React, TypeScript, Tailwind) and UI/UX design, and I'm actively looking for job opportunities!"
  },
    {
    keywords: ["Parents", "Siblings", "Crush", "Friends", "Personal life"],
    answer: "I prefer to keep my personal details private, but I’m happy to talk about my experience, skills, and the projects I’ve worked on. You can ask me about my background in web development, UI/UX design, or my tech stack!"
  },
  {
    keywords: ["internship", "ojt", "applied", "company", "hire", "hiring", "looking", "opportunity", "job"],
    answer: "I'm actively looking for job opportunities and open to offers. I can share my resume and discuss how I can contribute as a web/UI developer."
  },
  {
    keywords: ["skills", "technical", "abilities", "tech stack"],
    answer: "I have experience with React, TypeScript, Tailwind CSS, Node.js, Python, PHP, Laravel, and UI/UX design. I also work with Firebase, Git, and design tools like Figma and Adobe Suite."
  },
  {
    keywords: ["experience", "experiences", "work", "background", "projects", "built"],
    answer: "I've built a portfolio website (React + TypeScript + Tailwind), a Wedding RSVP site (Framer + Google Scripts), a Community Portal (React/Node.js/Stripe), and a Class Observation Form (Flask). I'm focused on practical frontend and full-stack development projects."
  },
  {
    keywords: ["contact", "email", "reach"],
    answer: "You can reach me at caadlawony@gmail.com or through my social media links on the portfolio. I'd love to connect!"
  },
  {
    keywords: ["gwa", "grade"],
    answer: "My current GWA is 1.32. I'm focused on practical skills and real-world projects alongside my academics."
  },
  {
    keywords: ["location", "where", "catanduanes"],
    answer: "I'm from Bagamanoc, Catanduanes, Philippines, and I graduated from Catanduanes State University."
  },
];

const getFallbackAnswer = (input: string): string => {
  const lowerInput = input.toLowerCase();
  for (const qa of fallbackQA) {
    if (qa.keywords.some(keyword => lowerInput.includes(keyword))) {
      return qa.answer;
    }
  }
  return "I'm not sure about that, but feel free to ask me about my skills, projects, experience, or reach out via email at caadlawony@gmail.com!";
};

// Friendly message shown only once when quota is first hit
const QUOTA_MESSAGE =
  "Hey there! 😊 I'm currently running on limited mode, so I might not be able to answer everything perfectly. Feel free to ask me about my skills, projects, or experience — I can still help with those!";

/**
 * Main function to get AI response
 */
export const getChatResponse = async (userMessage: string): Promise<string> => {
  // If variables are missing, don't even try the fetch
  if (!CHAT_FUNCTION_URL || !SUPABASE_KEY) {
    console.warn("Chatbot: Missing environment variables. Using fallback Q&A.");
    return getFallbackAnswer(userMessage);
  }

  // Already know quota is hit — skip the backend, go straight to Q&A
  if (useLocalOnly) {
    console.log("ℹ️ Chatbot: Using local Q&A (quota previously reached).");
    return getFallbackAnswer(userMessage);
  }

  try {
    const resp = await fetch(CHAT_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({ 
        messages: [{ role: "user", content: userMessage }] 
      }),
    });

    if (resp.ok) {
      const data = await resp.json();

      // AI responded successfully — return the response
      if (data.success && data.response) {
        console.log("🚀 Chatbot: Server responded successfully!");
        return sanitizeChatResponse(data.response);
      }

      // Quota exceeded — show notice once, then switch to local only
      if (data.quotaExceeded) {
        console.warn("⚠️ Chatbot: Gemini quota reached. Switching to local Q&A.");
        useLocalOnly = true;

        // First time hitting quota — show the notice + the matching Q&A answer
        if (!quotaNoticeSent) {
          quotaNoticeSent = true;
          return `${QUOTA_MESSAGE}\n\n${getFallbackAnswer(userMessage)}`;
        }

        // Already sent the notice before (shouldn't normally reach here, but just in case)
        return getFallbackAnswer(userMessage);
      }

      // Other non-success from backend — fall back quietly
      console.warn("⚠️ Chatbot: Non-success response from server. Falling back to Q&A.");

    } else {
      console.error(`❌ Chatbot: Server returned status ${resp.status}`);
      if (resp.status === 401) {
        console.warn("Hint: Check if 'JWT Verification' is disabled in your Supabase function settings.");
      }
    }
  } catch (err) {
    console.error("🌐 Chatbot: Network error or function unreachable.", err);
  }

  // Final fallback if anything above fails
  console.log("ℹ️ Chatbot: Falling back to local Q&A logic.");
  return getFallbackAnswer(userMessage);
};