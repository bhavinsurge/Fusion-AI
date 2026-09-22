// src/components/Chat/MessageBubble.tsx
import { Copy, Repeat2, ThumbsDown, ThumbsUp } from 'lucide-react';

interface MessageBubbleProps {
    role: 'user' | 'ai';
    text: string;
    selectedBy?: string | null;
}

export default function MessageBubble({ role, text, selectedBy }: MessageBubbleProps) {
    const isUser = role === 'user';

    return (
        <div className="group animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                    {isUser ? (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {/* Placeholder Avatar */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                    ) : (
                        <span className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded">
                            Fusion AI <span className="text-blue-500 font-normal">✓</span>
                            {selectedBy ? (
                                <span className="ml-2 text-xs font-normal text-gray-500">
                                    via {selectedBy}
                                </span>
                            ) : null}
                        </span>
                    )}
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
            </div>

            <div className={`text-[15px] leading-relaxed text-gray-800 whitespace-pre-wrap ${isUser ? 'font-medium text-lg' : ''}`}>
                {text}
            </div>

            {!isUser && (
                <div className="flex items-center gap-4 mt-4">
                    <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-indigo-500 transition-colors"><ThumbsUp /></button>
                        <button className="text-gray-400 hover:text-indigo-500 transition-colors"><ThumbsDown /></button>
                        <button className="text-gray-400 hover:text-indigo-500 transition-colors"><Copy /></button>
                    </div>
                    <button className="ml-auto flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors"><Repeat2 /> Regenerate
                    </button>
                </div>
            )}
        </div>
    );
}
