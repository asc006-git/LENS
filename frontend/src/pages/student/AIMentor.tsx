import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, User, Bot, Lightbulb } from 'lucide-react';
import { mentorApiClient } from '@/api/client';
import { useAuth } from '@/hooks/useAuth';
import { useLearningSessions } from '@/hooks/api/useLearningSession';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestions = [
  'Explain AVL tree rotations step by step',
  'What are the differences between BFS and DFS?',
  'Help me understand Big-O notation',
  'Quiz me on sorting algorithms',
];

export default function AIMentor() {
  const { user } = useAuth();
  const { data: sessions } = useLearningSessions();
  const activeSession = sessions?.find(s => s.status !== 'completed' && s.status !== 'failed');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1', role: 'assistant', timestamp: new Date(),
      content: `Hello! 👋 I'm your AI Learning Mentor. I can see you're studying${activeSession ? ` **${activeSession.title || 'a course'}**` : ''}. Ask me anything about your current concepts, or let's practice together!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const message = text || input.trim();
    if (!message) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const { data: res } = await mentorApiClient.post('/api/v1/mentor/chat', {
        message,
        sessionId: activeSession?.id || null,
        courseName: activeSession?.courseName || null,
      });
      const reply = res?.data?.response || res?.response || res?.message || "I'm sorry, I couldn't process that. Please try again.";

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(), role: 'assistant', timestamp: new Date(),
        content: reply,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(), role: 'assistant', timestamp: new Date(),
        content: `I'm sorry, I encountered an error: ${err.message || 'AI service unavailable'}. Please try again later.`,
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-120px)]">
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-copper-400" />
          <span className="text-xs font-medium text-copper-400">AI Learning Mentor</span>
        </div>
        <h1 className="text-xl font-bold text-white">AI Mentor Chat</h1>
        <p className="text-xs text-stone-400">Ask questions, get explanations, and practice concepts interactively.</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-copper-400" />
              </div>
            )}
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-coral-500/15 border border-coral-500/20 text-stone-200'
                : 'bg-white/3 border border-white/5 text-stone-300'
            }`}>
              {msg.content.split('\n').map((line, i) => (
                <p key={i} className={`${i > 0 ? 'mt-2' : ''}`}>
                  {line.split('**').map((part, j) =>
                    j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{part}</strong> : part
                  )}
                </p>
              ))}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-coral-500/15 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-coral-500" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-copper-400" />
            </div>
            <div className="bg-white/3 border border-white/5 rounded-2xl p-4">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-stone-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-stone-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-stone-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((suggestion) => (
            <button key={suggestion} onClick={() => handleSend(suggestion)}
              className="px-3 py-1.5 rounded-full bg-white/3 border border-white/5 text-xs text-stone-400 hover:text-white hover:border-white/15 transition-colors flex items-center gap-1.5">
              <Lightbulb className="w-3 h-3" /> {suggestion}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="input-field flex-1" placeholder="Ask your AI mentor anything..." />
        <button onClick={() => handleSend()} disabled={!input.trim()}
          className="btn-primary !px-4 disabled:opacity-40 disabled:cursor-not-allowed">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
