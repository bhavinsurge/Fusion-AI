// src/components/Chat/ChatArea.tsx
'use client';

import { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

interface Message {
    role: 'user' | 'ai';
    text: string;
}

interface ChatAreaProps {
    messages: Message[];
}

export default function ChatArea({ messages }: ChatAreaProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto pt-8 pb-48 px-4 md:px-20 scroll-smooth">
            <div className="max-w-3xl mx-auto space-y-8">
                {messages.map((msg, i) => (
                    <MessageBubble key={i} role={msg.role} text={msg.text} />
                ))}
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 mt-20">
                        <div className="text-6xl mb-4">👋</div>
                        <h2 className="text-2xl font-bold text-gray-700">Welcome to FUSION<br/><span className='flex justify-center'>A Next-Gen AI</span></h2>
                        <p className="mt-2">Start a conversation by typing below.</p>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
