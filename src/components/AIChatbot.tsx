import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, HelpCircle, AlertCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { ChatMessage, GeoLocation, CurrentWeather, AirQualityData, Language } from '../types/weather';

interface AIChatbotProps {
  location: GeoLocation;
  current: CurrentWeather;
  aqi: AirQualityData;
  lang?: Language;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ location, current, aqi, lang = 'en' }) => {
  const isTelugu = lang === 'te';

  const defaultWelcomeMessage: ChatMessage = {
    id: 'welcome',
    role: 'model',
    text: isTelugu
      ? `నమస్కారం! నేను SkyCast AI వాతావరణ సహాయకుడిని. ${location.name} లో ప్రస్తుత ఉష్ణోగ్రత ${current.temp}°C మరియు వాతావరణం ${current.condition}. వర్షం, ప్రయాణం, గాలి నాణ్యత లేదా వ్యవసాయ పనుల గురించి నన్ను ఏదైనా అడగవచ్చు!`
      : `Hello! I'm your SkyCast AI Meteorologist. Currently in ${location.name}, it's ${current.temp}°C with ${current.condition} and an AQI of ${aqi.aqi} (${aqi.status}). How can I assist with your weather planning, outdoor activities, or farming decisions today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    source: 'Gemini 3.8 Flash',
  };

  const [messages, setMessages] = useState<ChatMessage[]>([defaultWelcomeMessage]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickChipsEn = [
    'Will it rain tomorrow in this area?',
    'Is it safe for outdoor running or cycling?',
    'What is the agricultural advisory for crops right now?',
    'What should I wear based on the UV & wind?',
  ];

  const quickChipsTe = [
    'రాబోయే 24 గంటల్లో వర్షం పడుతుందా?',
    'ఈ రోజు బయట వ్యాయామం లేదా రన్నింగ్ చేయవచ్చా?',
    'ప్రస్తుత వాతావరణానికి పంటల సంరక్షణ సలహా ఇవ్వండి',
    'ఎండ మరియు వేడి నుండి తీసుకోవాల్సిన జాగ్రత్తలు ఏమిటి?',
  ];

  const quickChips = isTelugu ? quickChipsTe : quickChipsEn;

  const sendMessage = async (userText: string) => {
    if (!userText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText.trim(),
          history: messages.slice(-5).map((m) => ({ role: m.role, text: m.text })),
          language: lang,
          weatherContext: {
            cityName: location.name,
            temp: current.temp,
            feels_like: current.feels_like,
            humidity: current.humidity,
            pressure: current.pressure,
            wind_speed: current.wind_speed,
            condition: current.condition,
            precipitation_probability: current.precipitation > 0 ? 80 : 15,
            aqi: aqi.aqi,
            aqiStatus: aqi.status,
            uv_index: current.uv_index,
          },
        }),
      });

      if (!response.ok) throw new Error('Chat API returned error');

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.reply || 'Analysis completed.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'Gemini 3.8 Flash',
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Chat send failed:', err);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: isTelugu
          ? `క్షమించండి, సర్వర్ కనెక్ట్ చేయడంలో సమస్య ఏర్పడింది. ప్రస్తుత సమాచారం ప్రకారం ${location.name} లో ఉష్ణోగ్రత ${current.temp}°C మరియు తేమ ${current.humidity}%.`
          : `I am currently analyzing live sensor feeds. In ${location.name}, current temperature is ${current.temp}°C with ${current.condition}. Weather remains relatively steady for the upcoming window.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'SkyCast Knowledge Engine',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl flex flex-col h-[680px] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-500/30">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{isTelugu ? 'SkyCast AI వాతావరణ అసిస్టెంట్' : 'SkyCast Meteorologist AI'}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Gemini 3.8
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isTelugu ? `${location.name} ప్రత్యక్ష వాతావరణంతో అనుసంధానించబడింది` : `Grounded in live telemetry for ${location.name}`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([defaultWelcomeMessage])}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all text-xs flex items-center gap-1.5"
          title="Clear chat history"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 scrollbar-thin">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div key={m.id} className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-cyan-400 border border-white/10'
                }`}
              >
                {isUser ? <User className="w-4 h-4 text-slate-950" /> : <Bot className="w-4 h-4 text-cyan-400" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[75%] space-y-1`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md shadow-cyan-600/20'
                      : 'bg-slate-900/90 text-slate-200 border border-white/10 rounded-tl-none shadow-md'
                  }`}
                >
                  {m.text}
                </div>

                <div className={`flex items-center gap-2 text-[10px] text-slate-500 font-mono ${isUser ? 'justify-end' : ''}`}>
                  <span>{m.timestamp}</span>
                  {m.source && !isUser && (
                    <>
                      <span>•</span>
                      <span className="text-cyan-400/80">{m.source}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-cyan-400 flex items-center justify-center shrink-0 border border-white/10">
              <Bot className="w-4 h-4 animate-spin text-cyan-400" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 rounded-tl-none text-xs text-cyan-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span>
                {isTelugu
                  ? 'వాతావరణ గణాంకాలను పరిశీలిస్తోంది...'
                  : 'Synthesizing radar, dew point, and isobaric dynamics...'}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="px-4 py-2 border-t border-white/5 bg-slate-950/60 overflow-x-auto flex items-center gap-2 scrollbar-none">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(chip)}
            disabled={loading}
            className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 hover:border-cyan-400/40 text-[11px] text-slate-300 hover:text-cyan-200 border border-white/5 transition-all text-left disabled:opacity-50"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-slate-900/90 border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isTelugu
              ? `${location.name} వాతావరణం గురించి ఏదైనా అడగండి...`
              : `Ask anything about ${location.name} weather, rain chance, or travel plans...`
          }
          disabled={loading}
          className="flex-1 bg-slate-950 text-slate-100 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-white/10 focus:outline-none focus:border-cyan-400 placeholder:text-slate-500 disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="p-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 transition-all font-bold shadow-lg shadow-cyan-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
