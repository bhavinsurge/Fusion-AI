'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ChatArea from '@/components/Chat/ChatArea';
import InputArea from '@/components/Chat/InputArea';
import UpgradeTab from '@/components/UI/UpgradeTab';
import {
  AuthUser,
  ConversationSummary,
  clearConversations,
  clearSession,
  getConversation,
  getStoredUser,
  isAuthenticated,
  listConversations,
  sendChat,
} from '@/lib/api';

type Message = {
  role: 'user' | 'ai';
  text: string;
  selectedBy?: string | null;
};

export default function ChatPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }

    setUser(getStoredUser());
    void refreshConversations().finally(() => setReady(true));
  }, [router]);

  const refreshConversations = async () => {
    const items = await listConversations();
    setConversations(items);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const prompt = input.trim();
    const userMessage: Message = { role: 'user', text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const data = await sendChat(prompt, activeConversationId);
      setActiveConversationId(data.conversationId);
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: data.answer,
          selectedBy: data.selectedBy,
        },
      ]);
      await refreshConversations();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not reach the server.';
      if (message.toLowerCase().includes('unauthorized') || message === 'Not authenticated') {
        clearSession();
        router.replace('/login');
        return;
      }
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: `Error: ${message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setActiveConversationId(null);
  };

  const handleSelectConversation = async (id: string) => {
    try {
      const conversation = await getConversation(id);
      setActiveConversationId(conversation.id);
      setMessages(
        conversation.messages.map((m) => ({
          role: m.role,
          text: m.content,
          selectedBy: m.selectedBy,
        })),
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load conversation';
      setMessages([{ role: 'ai', text: `Error: ${message}` }]);
    }
  };

  const handleClearAll = async () => {
    await clearConversations();
    setConversations([]);
    handleNewChat();
  };

  const handleLogout = () => {
    clearSession();
    router.replace('/login');
  };

  if (!ready) {
    return (
      <div className="h-screen bg-[#FEFBEB] flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FEFBEB] font-sans overflow-hidden items-center justify-center">
      <div className="flex w-full h-full relative">
        <Sidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onClearAll={handleClearAll}
          onLogout={handleLogout}
          userName={user?.name || user?.email || 'User'}
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
