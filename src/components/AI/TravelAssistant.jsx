import React, { useState, useRef, useEffect } from 'react';
import { useTripStore } from '../../store/tripStore';
import { Sparkles, Send, Key } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function TravelAssistant() {
  const { chatHistory, addChatMessage, itinerary, budgetLimit, currency, exchangeRates, apiKey, setApiKey } = useTripStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  const suggestedQuestions = [
    "Analyze my budget health",
    "Suggest some local foods",
    "How can I optimize my itinerary?",
    "Show currency breakdown"
  ];

  const handleSetKey = (e) => {
    e.preventDefault();
    if (keyInput.trim()) {
      setApiKey(keyInput.trim());
    }
  };

  const handleSend = async (messageText) => {
    if (!messageText.trim() || loading || !apiKey) return;

    addChatMessage({ role: 'user', parts: [{ text: messageText }] });
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
      
      const currentRate = exchangeRates[currency] || 1;
      const totalSpentUSD = itinerary.reduce((sum, item) => sum + item.cost, 0);
      const convertedSpent = (totalSpentUSD * currentRate).toFixed(2);
      const convertedLimit = (budgetLimit * currentRate).toFixed(2);
      
      const systemContext = `
        You are Roamify's Gemini Travel Assistant.
        Current Context:
        - Currency: ${currency}
        - Total Budget: ${currency} ${convertedLimit}
        - Total Spent: ${currency} ${convertedSpent}
        - Itinerary Items:
        ${itinerary.map(item => `  * Day ${item.day}, ${item.time} - ${item.title} (${item.category}): ${currency} ${(item.cost * currentRate).toFixed(2)}`).join('\n')}
        
        Answer concisely and helpfully. Provide travel tips, budget analysis, or itinerary suggestions based on this context. Format output using markdown or plain text.
      `;

      // Build history format for Gemini API
      // We skip the first message if it's the welcome message because Gemini needs alternating user/model
      const historyForGemini = chatHistory
        .filter((msg, index) => index > 0) // Skip our custom welcome message
        .map(msg => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.parts[0].text }],
        }));

      const chat = model.startChat({
        systemInstruction: { role: 'system', parts: [{ text: systemContext }] },
        history: historyForGemini,
      });

      const result = await chat.sendMessage([{ text: messageText }]);
      const responseText = result.response.text();
      
      addChatMessage({ role: 'model', parts: [{ text: responseText }] });
    } catch (error) {
      console.error("Gemini API Error:", error);
      addChatMessage({ role: 'model', parts: [{ text: `Error: ${error.message}. Please check your API key.` }] });
      if (error.message.includes('API key not valid')) {
        setApiKey('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col h-[340px] shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-sky-500 animate-pulse" /> Gemini Assistant
        </h3>
        <span className="text-[9px] bg-sky-50 text-sky-600 border border-sky-200 px-1.5 py-0.5 rounded font-mono font-semibold">
          AI POWERED
        </span>
      </div>
      
      {!apiKey ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <Key className="w-8 h-8 text-slate-300" />
          <p className="text-xs text-slate-500 text-center px-4">Enter your Gemini API Key to activate the AI travel assistant.</p>
          <form onSubmit={handleSetKey} className="flex gap-2 w-full px-2">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 bg-slate-50 border border-sky-200 rounded-xl p-2 text-xs text-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-100 placeholder:text-slate-400"
            />
            <button type="submit" className="bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 px-3 py-2 rounded-xl text-white text-xs font-semibold cursor-pointer shadow-sm">
              Save
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* Scrollable Response Bubble Viewports */}
          <div className="flex-1 overflow-y-auto space-y-2 mb-2 pr-1 text-[11px] scrollbar-thin">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`p-2 rounded-xl max-w-[88%] break-words whitespace-pre-line ${
                msg.role === 'user' ? 'bg-gradient-to-br from-sky-500 to-blue-600 ml-auto text-white shadow-sm' : 'bg-slate-50 text-slate-700 border border-slate-200'
              }`}>
                {msg.parts && msg.parts[0] ? msg.parts[0].text : ""}
              </div>
            ))}
            {loading && <div className="text-sky-500 italic text-[10px] animate-pulse">Generating response...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Dynamic Quick Prompt Pills */}
          <div className="flex flex-wrap gap-1 mb-2.5">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => { setInput(''); handleSend(q); }}
                className="text-[9px] bg-sky-50 hover:bg-sky-100 text-sky-600 hover:text-sky-700 border border-sky-200 px-2 py-1 rounded-md transition-all cursor-pointer truncate max-w-[160px] font-medium"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Form Inputs Control */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(input); setInput(''); }} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about travel costs, budget status..."
              className="flex-1 bg-slate-50 border border-sky-200 rounded-xl p-2 text-xs text-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-100 placeholder:text-slate-400"
            />
            <button type="submit" disabled={loading} className="bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 p-2 rounded-xl text-white cursor-pointer disabled:opacity-40 shadow-sm">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </>
      )}
    </div>
  );
}