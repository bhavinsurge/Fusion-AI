// src/components/Chat/InputArea.tsx
'use client';

import { KeyboardEvent } from 'react';

interface InputAreaProps {
    input: string;
    setInput: (value: string) => void;
    onSend: () => void;
    loading?: boolean;
}

export default function InputArea({ input, setInput, onSend, loading = false }: InputAreaProps) {
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSend();
        }
    };

    return (
        <div className="absolute bottom-6 left-0 right-0 px-4 flex justify-center pointer-events-none z-50">
            <div className="w-full max-w-3xl bg-white rounded-full shadow-2xl shadow-indigo-100/50 border border-gray-100 p-2 flex items-center pointer-events-auto transition-all focus-within:ring-2 focus-within:ring-indigo-100">
                <div className="px-3">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 text-xs shadow-sm">🧠</div>
                </div>
                <input
                    className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm py-2 px-1 text-gray-700 placeholder-gray-400"
                    placeholder="What's in your mind?..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                />
                <button
                    onClick={onSend}
                    disabled={loading || !input.trim()}
                    className="w-12 h-12 rounded-full bg-[#6366F1] flex items-center justify-center text-white transition-transform active:scale-95 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m22 2-11 11"></path><path d="M22 2 15 22l-4-9-9-4 20-7Z"></path></svg>
                    )}
                </button>
            </div>
        </div>
    );
}
