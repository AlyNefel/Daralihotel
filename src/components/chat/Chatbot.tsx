import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', content: string }[]>([
    { role: 'bot', content: 'Welcome to Dar Ali. How can I assist you with your luxury stay today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mute, setMute] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Pre-load voices
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const speak = (text: string) => {
    if (mute || !window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB'; // Force English (British)
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    // Try to find an English male voice (preferably British for the accent)
    const voices = window.speechSynthesis.getVoices();
    
    // Log voices for debugging in browser console if needed
    // console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));

    const preferredVoice = 
      voices.find(v => v.lang === 'en-GB' && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('guy') || v.name.toLowerCase().includes('daniel'))) ||
      voices.find(v => v.lang.startsWith('en') && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('guy'))) ||
      voices.find(v => v.lang === 'en-GB') ||
      voices.find(v => v.lang.startsWith('en'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    // Adjust pitch and rate for a more masculine, sophisticated tone
    // Lower pitch usually sounds more male
    utterance.pitch = 0.85; 
    utterance.rate = 0.9;
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const systemInstruction = `You are "Arthur", the sophisticated English head concierge for "Dar Ali", a luxury guest house (Maison d'hôtes) located in the heart of the Medina of Tunis, Tunisia. 
      Dar Ali is a stunningly restored traditional residence, offering an authentic Tunisian experience with refined luxury.
      
      Context: We have Single, Double, Suite, and Deluxe rooms. Prices start from 200 TND. 
      Amenities: Traditional Tunisian breakfast served in the patio, rooftop terrace with views of the Medina and the Zitouna Mosque, personalized concierge service, and authentic architecture.
      Location: Medina of Tunis, Tunisia.
      
      Persona: You speak with the elegance, wit, and impeccable manners of a high-end British butler. You are warm, professional, and deeply knowledgeable about the Medina, the Zitouna Mosque, and the local souks.
      
      Be elegant, warm, and professional. Provide information about rooms, amenities, and local attractions in the Tunis Medina. Keep responses concise and sophisticated.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction,
        },
      });

      const text = response.text || "I apologize, I'm having trouble connecting. Please try again or contact our concierge.";
      
      setMessages(prev => [...prev, { role: 'bot', content: text }]);
      speak(text);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMsg = "I apologize, I'm having trouble connecting. Please try again or contact our concierge.";
      setMessages(prev => [...prev, { role: 'bot', content: errorMsg }]);
      speak(errorMsg);
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
            <Card className="flex flex-col h-[500px] shadow-2xl border-gold/20 overflow-hidden bg-white">
              <div className="bg-luxury-black p-4 flex justify-between items-center">
                <div className="flex items-center gap-3 text-white">
                  <div className="relative">
                    <Bot className="w-6 h-6 text-gold" />
                    {isSpeaking && (
                      <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 bg-gold rounded-full -z-10"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-serif font-medium leading-none">Dar Ali Concierge</p>
                    <p className="text-[10px] text-gold/60 uppercase tracking-widest mt-1">
                      {isSpeaking ? 'Speaking...' : 'Online'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      setMute(!mute);
                      if (!mute) window.speechSynthesis.cancel();
                    }} 
                    className="text-white hover:bg-white/10 h-8 w-8"
                  >
                    {mute ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 h-8 w-8">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-luxury-cream/30">
                {messages.map((msg, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-luxury-black text-white rounded-tr-none shadow-md' 
                        : 'bg-white text-luxury-black shadow-sm border border-gold/10 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gold/10">
                      <span className="flex gap-1.5">
                        <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-gold rounded-full" />
                        <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gold rounded-full" />
                        <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gold rounded-full" />
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-gold/10 flex gap-2">
                <Input 
                  placeholder="How can we help you?" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="rounded-full border-gold/20 focus-visible:ring-gold bg-luxury-cream/20"
                />
                <Button size="icon" onClick={handleSend} className="rounded-full bg-luxury-black hover:bg-luxury-black/90 shrink-0">
                  <Send className="w-4 h-4 text-gold" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full shadow-2xl bg-luxury-black hover:bg-luxury-black/90 border-2 border-gold/30 relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X className="w-7 h-7 text-gold" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <MessageSquare className="w-7 h-7 text-gold" />
              </motion.div>
            )}
          </AnimatePresence>
          {isSpeaking && (
            <motion.div 
              animate={{ scale: [1, 2], opacity: [0.5, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute inset-0 bg-gold/20 rounded-full"
            />
          )}
        </Button>
      </motion.div>
    </div>
  );
}
