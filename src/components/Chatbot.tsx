import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Loader2 } from "lucide-react";
import { getChatResponse } from "@/services/geminiService";
import profileImage from "@/assets/profile-light.jpg";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Lescy G. Caadlawon. Welcome to my portfolio! Feel free to ask me anything about my work, skills, or projects. 😊",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Check for dark mode preference
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // ✅ INTEGRATED: Call local Gemini service with API key from .env.local
      const text = await getChatResponse(userMessage.content);

      const assistantMessage: Message = {
        role: "assistant",
        content: text,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);

      const errorMessage: Message = {
        role: "assistant",
        content:
          "I apologize, but I'm having trouble responding right now. Please try again! 😊",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform ${
          isDark
            ? "bg-white text-gray-900 hover:bg-gray-100"
            : "bg-black text-white hover:bg-gray-900"
        } ${isOpen ? "hidden" : ""}`}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50"
          >
            <div
              className={`relative w-full sm:w-[400px] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col ${
                isDark
                  ? "bg-gray-900 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
              style={{ height: "85vh", maxHeight: "550px" }}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className={`absolute -top-3 -right-3 z-10 p-2 rounded-full transition-colors shadow-lg ${
                  isDark
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div
                className={`bg-gradient-to-r text-white px-4 py-3 rounded-t-2xl ${
                  isDark
                    ? "from-gray-800 to-gray-700"
                    : "from-black to-gray-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={profileImage}
                    alt="Lescy"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                  />
                  <div>
                    <h3 className="font-semibold">Lescy G. Caadlawon</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                      <p className="text-xs text-white/90">Online</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className={`flex-1 overflow-y-auto p-4 space-y-4 ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
                        message.role === "user"
                          ? "bg-blue-600"
                          : "bg-gray-700"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <img
                          src={profileImage}
                          alt="Lescy"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div
                      className={`flex flex-col ${
                        message.role === "user"
                          ? "items-end"
                          : "items-start"
                      } max-w-[80%]`}
                    >
                      <div
                        className={`rounded-lg px-3 py-2 ${
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : isDark
                            ? "bg-gray-700 text-gray-100 border border-gray-600"
                            : "bg-gray-100 text-gray-900 border border-gray-300"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>

                      {mounted && (
                        <span
                          className={`text-xs mt-1 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-700 overflow-hidden">
                      <img
                        src={profileImage}
                        alt="Lescy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 border ${
                        isDark
                          ? "bg-gray-700 text-gray-300 border-gray-600"
                          : "bg-gray-100 text-gray-600 border-gray-300"
                      }`}
                    >
                      <Loader2
                        className={`w-4 h-4 animate-spin ${
                          isDark ? "text-gray-400" : "text-gray-700"
                        }`}
                      />
                      <span className="text-sm">Lescy is typing...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div
                className={`border-t p-3 ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-300"
                }`}
              >
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Lescy anything..."
                    disabled={isLoading}
                    className={`flex-1 rounded-lg px-3 py-2 focus:outline-none text-sm border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-600 focus:border-black"
                    }`}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className={`rounded-lg px-4 transition-colors disabled:opacity-50 text-white ${
                      isDark
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-black hover:bg-gray-800"
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;