import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', content: string }[]>([
    { role: 'bot', content: 'Welcome to Dar Ali. How can I assist you with your luxury stay today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are the AI assistant for "Dar Ali", a luxury hotel in Tunisia. 
      Context: We have Single, Double, Suite, and Deluxe rooms. Prices start from 200 TND. 
      Amenities: Pool, Spa, Fine Dining, Private Beach.
      Be elegant, helpful, and professional.
      User: ${userMsg}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'bot', content: text }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { role: 'bot', content: "I apologize, I'm having trouble connecting. Please try again or contact our concierge." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 sm:w-96"
          >
            <Card className="flex flex-col h-[500px] shadow-2xl border-gold/20 overflow-hidden">
              <div className="bg-luxury-black p-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-white">
                  <Bot className="w-5 h-5 text-gold" />
                  <span className="font-serif font-medium">Dar Ali Concierge</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-luxury-cream/50">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-luxury-black text-white rounded-tr-none' 
                        : 'bg-white text-luxury-black shadow-sm border border-gold/10 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gold/10">
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.4s]" />
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-gold/10 flex gap-2">
                <Input 
                  placeholder="Ask about rooms, amenities..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="rounded-full border-gold/20 focus-visible:ring-gold"
                />
                <Button size="icon" onClick={handleSend} className="rounded-full bg-luxury-black hover:bg-luxury-black/90">
                  <Send className="w-4 h-4 text-gold" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-xl bg-luxury-black hover:bg-luxury-black/90 border-2 border-gold/30"
      >
        {isOpen ? <X className="w-6 h-6 text-gold" /> : <MessageSquare className="w-6 h-6 text-gold" />}
      </Button>
    </div>
  );
}
