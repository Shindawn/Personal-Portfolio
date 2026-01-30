// Get API key from environment
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

console.log("🔍 Gemini API configured:", API_KEY ? "✅ Ready" : "❌ Missing");

// Fallback Q&A data for when API is unavailable
const fallbackQA = [
  {
    keywords: ["hi", "hello", "hey", "introduce", "kamusta"],
    answer: "Hi! I'm Lescy, a BS Information Technology 4th year student from Catanduanes State University. I'm passionate about web development and UI/UX design. How can I help you?"
  },
  {
    keywords: ["who are you", "sino ka", "about you", "tell me about"],
    answer: "I'm Lescy G. Caadlawon, a 4th year BS IT student at Catanduanes State University. I specialize in web development (React, TypeScript, Tailwind) and UI/UX design. I'm currently looking for internship opportunities!"
  },
  {
    keywords: ["internship", "ojt", "applied", "company", "hire", "hiring", "looking", "opportunity"],
    answer: "I'm actively looking for internship/OJT opportunities and open to offers. I can share my documents (resume, endorsements, etc.) and I'm excited to contribute as a web/UI developer."
  },
  {
    keywords: ["skills", "technical", "abilities", "tech stack"],
    answer: "I have experience with React, TypeScript, Tailwind CSS, Node.js, Python, PHP, Laravel, and UI/UX design. I also work with Firebase, Git, and design tools like Figma and Adobe Suite."
  },
  {
    keywords: ["experience", "experiences", "work", "background", "projects", "built"],
    answer: "I've built a portfolio website (React + TypeScript + Tailwind), a Wedding RSVP site (Framer + Google Scripts), a Community Portal (React/Node.js/Stripe), and a Class Observation Form (Flask). I'm focused on frontend and full-stack student projects."
  },
  {
    keywords: ["contact", "email", "reach"],
    answer: "You can reach me at caadlawony@gmail.com or through my social media links on the portfolio. I'd love to connect!"
  },
  {
    keywords: ["gpa", "grade"],
    answer: "My current GPA is 1.40. I'm focused on practical skills and real-world projects alongside my academics."
  },
  {
    keywords: ["location", "where", "catanduanes"],
    answer: "I'm from Bagamanoc, Catanduanes, Philippines, and I'm studying at Catanduanes State University."
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

export const getChatResponse = async (userMessage: string): Promise<string> => {
  // Prefer server-side chat function for security and up-to-date knowledge
  const CHAT_FUNCTION_URL = import.meta.env.VITE_CHAT_FUNCTION_URL || "/functions/chat"; // set this in your env to your Supabase Function URL

  try {
    // Attempt to call serverless chat function first
    const resp = await fetch(CHAT_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: userMessage }] }),
    });

    if (resp.ok) {
      const data = await resp.json().catch(() => ({} as any));
      if (data?.response) return data.response;
      // if server returns an error shape, fall through to client-side handling
    } else {
      console.warn("Chat function responded with status", resp.status);
    }
  } catch (err) {
    console.warn("Chat function call failed:", err);
  }

  // SECURITY: Do NOT call Gemini from the client. Use the server-side chat function instead.
  // Fallback to local Q&A when the serverless function is unavailable.
  console.warn("Chat function unavailable — using local fallback Q&A. Ensure GEMINI_API_KEY is configured on the server.");
  return getFallbackAnswer(userMessage);
};