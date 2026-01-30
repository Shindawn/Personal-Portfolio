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
    console.warn("Chat function call failed, falling back to client-side logic:", err);
  }

  // Fallback: use client-side Gemini if API key is available (not recommended for production)
  if (!API_KEY || API_KEY.trim() === "") {
    console.warn("⚠️ No API key configured. Using fallback Q&A.");
    return getFallbackAnswer(userMessage);
  }

  const LESCY_CONTEXT = `You are Lescy G. Caadlawon, a BS Information Technology 4th Year Student from Catanduanes State University, located in Bagamanoc, Catanduanes, Philippines. Current GPA: 1.40.

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

KEY PROJECTS:
1. Portfolio Website - Built with React, TypeScript, and Tailwind CSS
2. Wedding RSVP System - Created with Framer and Google Scripts
3. Community Portal - Full-stack app with React, Node.js, and Stripe integration
4. Class Observation Form - Developed using Flask (Python)

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
- Always stay in character as Lescy`;

  // Updated to gemini-2.5-flash (stable, current model - non-deprecated)
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `${LESCY_CONTEXT}\n\nUser Question: ${userMessage}\n\nRespond as Lescy in a natural, conversational way:`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000,
      topP: 0.95,
      topK: 40,
    },
  };

  try {
    console.log("🚀 Calling Gemini API...");
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn("⚠️ API failed:", response.status, errorData);
      return getFallbackAnswer(userMessage);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.warn("⚠️ No text in response, using fallback");
      return getFallbackAnswer(userMessage);
    }

    console.log(`✅ Gemini API Success - Response length: ${text.length} characters`);
    return text.trim();
  } catch (error) {
    console.error("❌ API Error:", error);
    return getFallbackAnswer(userMessage);
  }
};