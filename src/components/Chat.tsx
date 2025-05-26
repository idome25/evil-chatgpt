import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function fetchLie(question: string): Promise<string> {
    const res = await fetch('http://localhost:3001/api/lie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    return data.lie;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    try {
      let response = await fetchLie(input);
      if (response.length > 2000) {
        response = response.slice(0, 2000) + '...';
      }
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    }
    setLoading(false);
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    // Adjust textarea height based on content
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Initial screen: show prompt and input bar centered
  if (messages.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#343541] px-4">
        <div className="w-full flex flex-col items-center">
          <h1 className="text-3xl font-semibold mb-8 mt-8 text-center text-white">What can I help you with?</h1>
          <form onSubmit={handleSubmit} className="w-[60vw] max-w-2xl flex flex-row items-center justify-center gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything"
              className="flex-1 text-base bg-[#444654] border border-gray-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none overflow-hidden px-4 py-3 min-h-[48px] placeholder-gray-400"
              rows={1}
              disabled={loading}
              autoFocus
            />
          </form>
        </div>
      </div>
    );
  }

  // Chat UI after first question
  return (
    <div className="flex flex-col min-h-screen bg-[#343541] items-center justify-end">
      {/* Messages container */}
      <div className="flex-1 w-full max-w-2xl mx-auto px-4 pt-8 pb-28 flex flex-col gap-6 overflow-y-auto" style={{ paddingBottom: '100px', minHeight: 0 }}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-2xl px-5 py-3 shadow-md max-w-[75%] break-words text-base font-normal
                ${message.role === 'user'
                  ? 'bg-violet-900 text-violet-100 self-end'
                  : 'bg-purple-900 text-purple-100 self-start'}`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-5 py-3 shadow-md max-w-[75%] bg-purple-900 text-purple-100 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-150"></div>
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-300"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area pinned to bottom and centered */}
      <div className="flex justify-center left-0 right-0 bg-[#343541] border-t border-gray-700 py-2 z-10 fixed bottom-0">
        <form onSubmit={handleSubmit} className="w-[80vw] max-w-2xl flex flex-row items-center gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What would you like to know?"
            className="flex-1 text-base bg-[#444654] border border-gray-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none overflow-hidden px-3 py-2 min-h-[36px] placeholder-gray-400"
            rows={1}
            disabled={loading}
            autoFocus
          />
        </form>
      </div>
      <div className="text-xs text-gray-400 mt-2 text-center w-full pb-2 fixed bottom-0 left-0 right-0 z-0">
        ChatGPT may display inaccurate info, including about people
      </div>
    </div>
  );
}