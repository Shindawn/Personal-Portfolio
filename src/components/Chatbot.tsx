import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Loader2 } from "lucide-react";
import { getChatResponse } from "@/services/geminiService";
import profileImage from "@/assets/profile-light.jpg";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Lescy G. Caadlawon. Welcome to my portfolio! Feel free to ask me anything about my work, skills, or projects. 😊",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
    
    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    });
    
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const text = await getChatResponse(userMessage.content);
      const assistantMessage: Message = {
        role: 'assistant',
        content: text,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try again! 😊",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
          isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-900'
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
            // 🔥 RESPONSIVE WRAPPER: Full screen on mobile, floating on desktop
            className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex justify-end"
          >
            <div className={`relative flex flex-col w-full sm:w-[400px] h-[85vh] sm:h-[600px] 
              // UI Tweaks: No rounded corners at bottom on mobile to look integrated
              rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden ${
              isDark ? 'bg-gray-900 border-t sm:border border-gray-700' : 'bg-white border-t sm:border border-gray-200'
            }`}>
              
              {/* Header */}
              <div className={`flex-shrink-0 px-4 py-4 sm:py-3 flex items-center justify-between bg-gradient-to-r ${
                isDark ? 'from-gray-800 to-gray-700' : 'from-black to-gray-800'
              } text-white`}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={profileImage} 
                      alt="Lescy" 
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Lescy G. Caadlawon</h3>
                    <p className="text-[10px] text-white/70 uppercase tracking-wider">Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Area */}
              <div 
                ref={scrollRef} 
                className={`flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain scroll-smooth ${
                  isDark ? 'bg-gray-900' : 'bg-gray-50'
                }`}
              >
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
                      message.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <img src={profileImage} alt="Lescy" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                      <div className={`rounded-2xl px-4 py-2 text-sm ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : isDark 
                            ? 'bg-gray-800 text-gray-100 border border-gray-700 rounded-tl-none' 
                            : 'bg-white text-gray-900 border border-gray-200 shadow-sm rounded-tl-none'
                      }`}>
                        <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <span className="text-[10px] mt-1 opacity-50 px-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden animate-pulse">
                      <img src={profileImage} alt="Lescy" className="w-full h-full object-cover opacity-50" />
                    </div>
                    <div className={`flex items-center gap-2 rounded-2xl rounded-tl-none px-4 py-2 border ${
                      isDark ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-white text-gray-500 border-gray-200 shadow-sm'
                    }`}>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span className="text-xs italic">Lescy is typing...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className={`p-4 sm:p-3 border-t ${
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
              }`}>
                <div className="flex gap-2 items-center">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Message Lescy..."
                    disabled={isLoading}
                    className={`flex-1 rounded-xl px-4 py-3 sm:py-2 text-sm border focus:outline-none transition-all ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-500' 
                        : 'bg-gray-100 border-transparent text-gray-900 placeholder-gray-500 focus:bg-white focus:border-gray-300'
                    }`}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className={`p-3 sm:p-2 rounded-xl transition-all flex items-center justify-center disabled:opacity-30 ${
                      isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {/* Mobile Spacing for Home Indicator */}
                <div className="h-2 sm:hidden"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;