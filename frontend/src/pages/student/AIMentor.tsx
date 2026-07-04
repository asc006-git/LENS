import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import Card from '@/components/ui/Card';
import Breadcrumb from '@/components/layout/Breadcrumb';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIMentor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI learning mentor. I can help you understand concepts, explain difficult topics, or guide your learning journey. What would you like to explore today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        "That's a great question! Let me break it down for you. The concept you're asking about relates to the fundamental principles we've been exploring. Would you like me to provide a specific example?",
        "I understand your confusion. This concept often trips students up. The key is to think about it in terms of real-world applications. Here's a simple analogy...",
        "Excellent thinking! You're connecting the dots well. To deepen your understanding, consider how this concept relates to what you learned in your previous session.",
        "Let me explain this step by step. First, understand the core principle, then we'll build on that foundation. The relationship between these concepts is crucial.",
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb items={[{ label: 'AI Mentor' }]} />

      <h1 className="text-2xl font-bold text-secondary-900 mb-2">AI Mentor</h1>
      <p className="text-secondary-500 mb-6">Your contextual AI learning companion.</p>

      <Card padding="none" className="h-[600px] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${
                message.role === 'user'
                  ? 'bg-primary-500 text-white rounded-br-sm'
                  : 'bg-secondary-100 text-secondary-900 rounded-bl-sm'
              }`}>
                {message.content}
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-secondary-200 rounded-full flex items-center justify-center shrink-0">
                  <User size={16} className="text-secondary-600" />
                </div>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-secondary-100 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-secondary-100 p-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Sparkles size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your AI mentor anything..."
                className="w-full pl-10 pr-4 py-3 bg-secondary-50 border border-secondary-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
