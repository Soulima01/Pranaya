'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useUserStore } from '@/lib/store/userStore'; 
import { sendChatMessage } from '@/lib/api';
import EmergencyOverlay from '@/app/components/EmergencyOverlay';
import HealthDrawer from '@/app/components/HealthDrawer'; 
import { Send, Activity, Check, X, ClipboardCheck, LayoutDashboard, Paperclip, FileImage, Mic, MicOff, Volume2, Keyboard, Sparkles } from 'lucide-react';

// --- 🤖 AVATAR COMPONENT ---
const AvatarPanel = ({ 
  isSpeaking, 
  isListening, 
  isTyping
}: { 
  isSpeaking: boolean; 
  isListening: boolean;
  isTyping: boolean;
}) => {
  
  const VIDEO_TALK = "/videos/avatar-talk.mp4"; 
  const IMG_STATIC = "/videos/avatar-static.png"; 

  return (
    <div className="h-full flex flex-col p-6 bg-white relative overflow-hidden">
      <div className="mb-6 text-center z-10">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Pranaya AI</h2>
        <div className="flex justify-center items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-green-500'}`}></span>
            <span className="text-sm text-green-600 font-medium">Active Companion</span>
        </div>
      </div>
      <div className="flex-1 w-full bg-gray-50 rounded-3xl overflow-hidden relative shadow-inner border border-gray-100">
        {isSpeaking ? (
            <video key="talk" src={VIDEO_TALK} autoPlay loop muted playsInline className="w-full h-full object-cover animate-in fade-in duration-300" />
        ) : (
            <img src={IMG_STATIC} alt="Avatar Idle" className="w-full h-full object-cover animate-in fade-in duration-300" />
        )}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <div className="bg-black/60 backdrop-blur-md text-white px-6 py-2 rounded-full flex items-center gap-3 shadow-lg transition-all duration-300">
                {isListening ? <><Mic size={18} className="text-red-400 animate-pulse" /><span className="font-medium text-sm">Listening...</span></> : 
                 isSpeaking ? <><Volume2 size={18} className="text-green-400 animate-bounce" /><span className="font-medium text-sm">Speaking...</span></> : 
                 isTyping ? <><Keyboard size={18} className="text-blue-400" /><span className="font-medium text-sm">Watching...</span></> : 
                 <span className="text-sm text-gray-300">Idle</span>}
            </div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-blue-800 text-sm font-medium bg-blue-50 py-3 px-4 rounded-xl inline-block border border-blue-100">"I'm here."</p>
      </div>
    </div>
  );
};

type Message = {
  role: 'user' | 'bot';
  content: string;
  type?: 'text' | 'diagnosis' | 'emergency' | 'myth' | 'tracker_log'; 
  data?: any; 
  image?: string; 
};

export default function ChatPage() {
  const router = useRouter();
  const { profile, addWater, addMed, toggleMed, addVaccine, setPeriodDate } = useUserStore();

  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: `Namaste ${profile.name}! I am Pranaya. I'm listening.` }
  ]);
  const [loading, setLoading] = useState(false);
  
  // --- 🟢 NEW: NUDGES STATE ---
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [isEmergency, setIsEmergency] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); 

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!profile.isAssessmentDone) router.push('/assessment');
  }, [profile.isAssessmentDone, router]);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => { setIsTyping(false); }, 1500);
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      speak("Go ahead, describe your problems. I am listening.");
      setTimeout(() => {
          const recognition = new (window as any).webkitSpeechRecognition();
          recognition.continuous = false;
          recognition.lang = 'en-US'; 
          recognition.interimResults = false;
          recognition.onstart = () => setIsListening(true);
          recognition.onend = () => setIsListening(false);
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
          };
          recognition.start();
      }, 2500); 
    } else {
      alert("Voice input is not supported in this browser.");
    }
  };

  const speak = (text: string) => {
    if (isMuted || !text) return;
    const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/[*#]/g, '');
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google UK English Female') || v.name.includes('Microsoft Zira')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.pitch = 1.05; utterance.rate = 1.0; 
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setSelectedImage(reader.result as string);
        reader.readAsDataURL(file);
    }
  };

  const handleSend = async (manualInput?: string) => {
    const textToSend = manualInput || input;
    if (!textToSend.trim() && !selectedImage) return;
    
    const userMsg = textToSend;
    const imageToSend = selectedImage; 
    
    setInput('');
    setSuggestions([]); // Clear old suggestions
    setIsTyping(false);
    setSelectedImage(null);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const userContextString = `[PROFILE] Name:${profile.name}, Age:${profile.age}, Weight:${profile.weight}, Gender:${profile.gender}, Diabetic:${profile.isDiabetic}`;
    const historyContext = messages.map(m => `${m.role === 'user' ? 'User' : 'Bot'}: ${m.content}`);
    const fullContext = [userContextString, ...historyContext];
    
    setMessages(prev => [...prev, { role: 'user', content: userMsg || "Analyzed this image:", image: imageToSend || undefined }]);
    setLoading(true);

    const response = await sendChatMessage(userMsg, "guest", fullContext, profile.gender, imageToSend);
    setLoading(false);

    if (response) {
      // --- 🟢 CATCH NUDGES ---
      if (response.suggestions && Array.isArray(response.suggestions)) {
        setSuggestions(response.suggestions);
      }

      let botReplyText = ""; 

      if (response.routed_to === 'tracker') {
          const data = response.response?.data; 
          if (data) {
              if (data.category === 'water') {
                 let amount = 250;
                 if (data.quantity) {
                     const parsed = parseInt(data.quantity.toString().replace(/\D/g, ''));
                     if (!isNaN(parsed)) amount = parsed;
                 }
                 addWater(amount);
              }
              if (data.category === 'medicine') {
                 const medName = data.item || 'Medicine';
                 const currentMeds = useUserStore.getState().trackers.meds || [];
                 const existingMed = currentMeds.find(m => typeof m === 'object' && m.name && m.name.toLowerCase().includes(medName.toLowerCase()));
                 if (existingMed) toggleMed(existingMed.id, true); 
                 else addMed(medName); 
              }
              if (data.category === 'vaccine') addVaccine(data.item || 'Vaccine');
              if (data.category === 'period') {
                 const dateToLog = data.item || 'Today';
                 setPeriodDate(dateToLog);
              }
              botReplyText = response.response.message || "Logged successfully.";
              setMessages(prev => [...prev, { role: 'bot', content: botReplyText, type: 'tracker_log' }]);
          } else {
              botReplyText = "I've noted that down.";
              setMessages(prev => [...prev, { role: 'bot', content: botReplyText }]);
          }
      }
      else if (response.routed_to === 'emergency') {
        setIsEmergency(true);
        botReplyText = response.response.message;
        setMessages(prev => [...prev, { role: 'bot', content: botReplyText, type: 'emergency' }]);
        new Audio('/siren.mp3').play().catch(e => console.log(e));
      } 
      else if (response.routed_to === 'diagnosis') {
        const report = response.response.data;
        botReplyText = `Here is my analysis. ${report.immediate_advice}`;
        setMessages(prev => [...prev, { role: 'bot', content: report.immediate_advice, type: 'diagnosis', data: report }]);
      } 
      else if (response.routed_to === 'myth_buster') {
        const factCheck = response.response.data;
        botReplyText = `${factCheck.verdict}. ${factCheck.explanation}`;
        setMessages(prev => [...prev, { role: 'bot', content: factCheck.explanation, type: 'myth', data: factCheck }]);
      }
      else {
        botReplyText = response.response.message;
        setMessages(prev => [...prev, { role: 'bot', content: botReplyText }]);
      }
      speak(botReplyText);
    }
  };

  if (!profile.isAssessmentDone) return <div>Loading...</div>;

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden relative">
      <EmergencyOverlay active={isEmergency} onClose={() => setIsEmergency(false)} />
      <HealthDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} chatHistory={messages} />
      
      <div className="p-4 bg-white border-b flex items-center justify-between shadow-sm z-20 shrink-0">
        <h1 className="font-bold text-xl text-blue-600 flex items-center gap-2"><Activity className="w-6 h-6" /> Pranaya</h1>
        <div className="flex items-center gap-3">
            <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">{isMuted ? <Volume2 size={20}/> : <Volume2 size={20}/>}</button>
            <button onClick={() => setIsDrawerOpen(true)} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-200 transition"><LayoutDashboard size={18} /> My Health Data</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden w-full">
        <div className="w-[65%] flex flex-col relative border-r border-gray-200">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
                {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] p-4 rounded-2xl shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border rounded-bl-none text-gray-800'}`}>
                    {m.image && <img src={m.image} alt="Upload" className="max-w-full h-auto rounded-lg mb-2 border border-white/20" />}
                    {m.type === 'tracker_log' && <div className="flex items-center gap-2 text-green-700 font-bold mb-2 pb-2 border-b border-green-100"><ClipboardCheck size={20} /> Data Saved</div>}
                    {m.type === 'myth' && m.data && <div className="mb-3 border-b pb-3 font-bold text-lg flex items-center gap-2">{m.data.verdict === 'FACT' ? <Check className="text-green-600"/> : <X className="text-red-600"/>}{m.data.verdict}</div>}
                    <div className="whitespace-pre-wrap leading-relaxed text-sm [&>h3]:font-bold [&>h3]:text-blue-800 [&>h3]:mt-4 [&>h3]:mb-2 [&>h3]:text-lg [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>b]:font-black" dangerouslySetInnerHTML={{ __html: m.content }} />
                    {m.type === 'diagnosis' && m.data && (
                        <div className="mt-4 bg-blue-50 rounded-xl p-3 border border-blue-100">
                        <div className="font-bold text-blue-800 mb-2">Potential Conditions:</div>
                        {m.data.potential_conditions.map((c:any, idx:number) => (
                            <div key={idx} className="bg-white p-3 rounded mb-3 text-sm border border-blue-100 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-base">{idx+1}. {c.name}</span>
                                    <span className={`text-xs px-2 py-1 rounded font-bold ${c.likelihood === 'High' ? 'bg-red-100 text-red-700' : c.likelihood === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{c.likelihood}</span>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{c.reasoning}</p>
                            </div>
                        ))}
                        </div>
                    )}
                    </div>
                </div>
                ))}
                {loading && <div className="text-gray-400 text-sm ml-4 animate-pulse">Pranaya is processing...</div>}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area with Suggestions */}
            <div className="p-4 bg-white border-t z-20">
                {/* --- 🟢 SUGGESTIONS BAR --- */}
                {suggestions.length > 0 && (
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
                    <div className="flex items-center text-xs font-bold text-blue-600 mr-2"><Sparkles size={14} /> Suggested:</div>
                    {suggestions.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleSend(s)}
                        className="whitespace-nowrap px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100 hover:bg-blue-100 transition active:scale-95"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {selectedImage && (
                    <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg mb-2 max-w-fit">
                        <FileImage size={20} className="text-blue-600" />
                        <span className="text-xs text-gray-600">Image attached</span>
                        <button onClick={() => setSelectedImage(null)} className="ml-2 text-gray-400 hover:text-red-500"><X size={16}/></button>
                    </div>
                )}
                <div className="flex gap-2 items-center">
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200"><Paperclip size={20} /></button>
                    <button onClick={startListening} className={`p-3 rounded-xl ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600'}`}>{isListening ? <MicOff size={20} /> : <Mic size={20} />}</button>
                    <input type="text" value={input} onChange={handleInputChange} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type or speak..." className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                    <button onClick={() => handleSend()} disabled={loading} className="p-3 bg-blue-600 text-white rounded-xl"><Send size={24} /></button>
                </div>
            </div>
        </div>

        <div className="w-[35%] bg-white h-full">
            <AvatarPanel isSpeaking={isSpeaking} isListening={isListening} isTyping={isTyping} />
        </div>
      </div>
    </div>
  );
}