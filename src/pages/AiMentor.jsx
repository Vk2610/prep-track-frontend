import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageSquare, RefreshCw, XCircle } from 'lucide-react';
import { aiAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AiMentor = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi! I'm your AI Mentor. I've analyzed your performance data. How can I help you with your CAT preparation today?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const chatHistory = messages.slice(1); // Exclude the initial welcome message
            const response = await aiAPI.chat({ message: input, chatHistory });

            if (response.data.success) {
                setMessages(prev => [...prev, { role: 'assistant', content: response.data.data }]);
            }
        } catch (error) {
            console.error('AI Error:', error);
            const errorMsg = error.response?.data?.message || "I'm sorry, I'm having trouble connecting right now. Please try again later.";
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: errorMsg
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestions = [
        "How can I improve my Quants score?",
        "Analyze my latest mock performance",
        "Give me a study plan for next week",
        "How to improve reading speed for VARC?"
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-120px)] flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="glass-badge mb-2">AI POWERED</div>
                    <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
                        AI MENTOR <Sparkles className="w-8 h-8 text-indigo-400" />
                    </h1>
                </div>
            </div>

            {/* Chat Container */}
            <div className="glass-card flex-1 flex flex-col overflow-hidden border-white/10 p-0!">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user'
                                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                                    }`}>
                                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                                </div>
                                <div className={`p-4 rounded-3xl text-gray-200 leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'bg-indigo-500/10 rounded-tr-none'
                                    : 'bg-white/5 rounded-tl-none'
                                    }`}>
                                    <div className="whitespace-pre-wrap">{msg.content}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex gap-4 max-w-[85%]">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-lg animate-pulse">
                                    <Bot size={20} />
                                </div>
                                <div className="bg-white/5 p-4 rounded-3xl rounded-tl-none text-gray-400 flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    AI is thinking...
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggestions and Input Area */}
                <div className="p-6 border-t border-white/10 bg-white/5">
                    {messages.length === 1 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {suggestions.map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(suggestion)}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-gray-300 transition-all hover:border-indigo-500/50"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSend} className="relative group">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask your mentor anything..."
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all group-hover:border-white/20"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                    <p className="text-center text-[10px] text-gray-500 mt-4 uppercase tracking-[0.2em]">
                        Advanced AI Mentor • Personalized Advice
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AiMentor;
