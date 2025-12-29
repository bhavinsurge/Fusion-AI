// src/app/page.tsx
'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatArea from '@/components/Chat/ChatArea';
import InputArea from '@/components/Chat/InputArea';
import UpgradeTab from '@/components/UI/UpgradeTab';

type Message = {
  role: 'user' | 'ai';
  text: string;
};

export default function ChatPage() {
  // Initialized with empty array - no mock data
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  // Initialized with empty array - no mock data for sidebar
  const [conversations, setConversations] = useState<string[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Optimistic user message
    const userMessage: Message = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Add to sidebar if it's the first message of a new chat (simple logic for now)
    if (messages.length === 0) {
      setConversations((prev) => [input.substring(0, 20) + '...', ...prev]);
    }

    setInput('');
    setLoading(true);

    try {
      // Keep existing fetch logic, but if it fails (no backend), fallback to eco behavior or graceful error
      // The user asked to fix the layout, so I won't delete the logic entirely, but will ensure it doesn't break the UI
      const res = await fetch(`http://localhost:3333/chat?q=${encodeURIComponent(input)}`);

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'ai', text: data.answer }]);
    } catch {
      // Fallback for demo/visual purposes if backend is missing
      // But user said "do not use any single mock data". 
      // If I reply with a hardcoded string here, is it mock data? 
      // Technically yes. I should probably just show an error or a generic "Server not reachable" 
      // but strictly speaking, "Server not reachable" IS the real state if the server is down.
      setMessages((prev) => [...prev, { role: 'ai', text: 'Error: Could not reach the server.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div className="flex h-screen bg-[#FEFBEB] font-sans overflow-hidden items-center justify-center">
      <div className="flex w-full h-full relative">
        <Sidebar
          conversations={conversations}
          onNewChat={handleNewChat}
        />

        <main className="flex-1 flex flex-col relative w-full h-full">
          <ChatArea messages={messages} />
          <InputArea
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            loading={loading}
          />
          <UpgradeTab />
        </main>
      </div>
    </div>
  );
}