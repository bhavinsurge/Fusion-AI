import { ConversationSummary } from '@/lib/api';

interface SidebarProps {
  conversations?: ConversationSummary[];
  activeConversationId?: string | null;
  onNewChat?: () => void;
  onSelectConversation?: (id: string) => void;
  onClearAll?: () => void;
  onLogout?: () => void;
  userName?: string;
  className?: string;
}

export default function Sidebar({
  conversations = [],
  activeConversationId = null,
  onNewChat,
  onSelectConversation,
  onClearAll,
  onLogout,
  userName = 'User',
  className = '',
}: SidebarProps) {
  return (
    <aside
      className={`w-70 min-w-70 shrink-0 bg-white flex flex-col rounded-r-[40px] shadow-sm z-20 border-r border-gray-100 h-full ${className}`}
    >
      <div className="p-8">
        <h1 className="font-bold text-xl tracking-tight text-black">Fusion AI</h1>
      </div>

      <div className="px-6 flex gap-2 mb-8">
        <button
          onClick={onNewChat}
          className="flex-1 bg-[#6366F1] hover:bg-indigo-700 text-white rounded-full py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-all"
        >
          + New chat
        </button>
        <button className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center transition-colors hover:bg-gray-800">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-6">
        <div className="px-4 text-xs font-semibold text-gray-400 flex justify-between">
          <span>Your conversations</span>
          <button
            type="button"
            onClick={onClearAll}
            className="text-indigo-500 cursor-pointer hover:text-indigo-600"
          >
            Clear All
          </button>
        </div>
        <div className="space-y-1">
          {conversations.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectConversation?.(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all text-left ${
                activeConversationId === item.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className="truncate">{item.title}</span>
            </button>
          ))}
          {conversations.length === 0 && (
            <div className="px-4 py-4 text-sm text-gray-400 italic text-center">
              No recent conversations
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-3">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-6 py-3 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Log out
        </button>
        <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-gray-200">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-gray-400"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-700 truncate">
            {userName}
          </span>
        </div>
      </div>
    </aside>
  );
}
