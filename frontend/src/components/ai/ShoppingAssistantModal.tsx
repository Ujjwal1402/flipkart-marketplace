/**
 * Flipkart AI Shopping Assistant (Genie) Modal
 * Powered by Gemini via Backend AI Service
 */
import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  ExternalLink,
  Loader2,
  Zap
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { apiClient } from '../../api/client';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedIds?: string[];
  time: string;
}

export const ShoppingAssistantModal: React.FC = () => {
  const { activeModal, setActiveModal, setSelectedProduct } = useStore();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: "Namaste! I am your **Flipkart Smart Shopping Assistant**. Ask me anything—whether comparing smartphones, finding deals under your budget, or checking product features!",
      time: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  if (activeModal !== 'aiAssistant') return null;

  const handleSend = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q || q.trim() === '' || isThinking) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    try {
      const response = await apiClient.askAiAssistant(q);
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        suggestedIds: response.suggestedProductIds,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: 'I apologize, but I had a hiccup analyzing that. Please try asking again!',
          time: 'Just now'
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleOpenSuggestedProduct = async (id: string) => {
    try {
      const data = await apiClient.getProductById(id);
      if (data.product) {
        setSelectedProduct(data.product);
        setActiveModal(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div
        id="flipkart-ai-genie-modal"
        className="bg-white w-full max-w-2xl rounded-md shadow-2xl overflow-hidden my-4 h-[620px] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-[#2874f0] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-yellow-400 text-blue-900 flex items-center justify-center shadow-xs">
              <Sparkles size={18} className="fill-blue-900" />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                Flipkart Smart Genie
                <span className="bg-yellow-300 text-blue-950 font-black text-[10px] px-1.5 py-0.2 rounded">
                  AI POWERED
                </span>
              </h3>
              <p className="text-[11px] text-blue-100">Live Recommendations & Catalog Comparison</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-white hover:bg-white/20 p-1 rounded-full transition cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-blue-50/70 px-4 py-2 border-b border-blue-100 flex gap-2 overflow-x-auto text-[11px] font-semibold text-blue-900 no-scrollbar">
          <button
            onClick={() => handleSend('Best camera phone under ₹70,000')}
            className="px-2.5 py-1 bg-white border border-blue-200 rounded-full hover:bg-blue-100 transition whitespace-nowrap"
          >
            📱 Best phone under ₹70,000
          </button>
          <button
            onClick={() => handleSend('Compare iPhone 15 vs Samsung S24 Ultra')}
            className="px-2.5 py-1 bg-white border border-blue-200 rounded-full hover:bg-blue-100 transition whitespace-nowrap"
          >
            ⚖️ iPhone 15 vs S24 Ultra
          </button>
          <button
            onClick={() => handleSend('Best noise cancelling headphones')}
            className="px-2.5 py-1 bg-white border border-blue-200 rounded-full hover:bg-blue-100 transition whitespace-nowrap"
          >
            🎧 Best ANC Headphones
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gray-50 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={15} />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-lg p-3 leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#2874f0] text-white rounded-tr-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Suggested Product Cards */}
                {msg.suggestedIds && msg.suggestedIds.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-gray-100 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                      Recommended Matches:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {msg.suggestedIds.map((id) => (
                        <button
                          key={id}
                          onClick={() => handleOpenSuggestedProduct(id)}
                          className="bg-blue-50 hover:bg-blue-100 text-[#2874f0] border border-blue-200 rounded px-2.5 py-1 text-[11px] font-bold flex items-center gap-1 transition"
                        >
                          <span>View Product ({id})</span>
                          <ExternalLink size={11} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <span
                  className={`text-[10px] block mt-1.5 text-right ${
                    msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                  }`}
                >
                  {msg.time}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User size={15} />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-gray-500 text-xs italic">
              <Loader2 size={14} className="animate-spin text-[#2874f0]" />
              <span>Flipkart Genie is finding the best matches...</span>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-3 bg-white border-t border-gray-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything (e.g. 'Best laptop for students under ₹1,30,000')"
              className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-full text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isThinking}
              className="w-9 h-9 rounded-full bg-[#2874f0] hover:bg-blue-700 text-white flex items-center justify-center disabled:opacity-40 transition shadow-xs cursor-pointer"
              aria-label="Send"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
