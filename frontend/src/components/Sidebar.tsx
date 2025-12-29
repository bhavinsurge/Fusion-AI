// src/components/Sidebar.tsx

interface SidebarProps {
  conversations?: string[]; // Making it optional as we are removing mock data logic for now
  onNewChat?: () => void;
  className?: string;
}

export default function Sidebar({ conversations = [], onNewChat, className = '' }: SidebarProps) {
  return (
    <aside className={`w-70 min-w-70 shrink-0 bg-white flex flex-col rounded-r-[40px] shadow-sm z-20 border-r border-gray-100 h-full ${className}`}>
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
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-6">
        <div className="px-4 text-xs font-semibold text-gray-400 flex justify-between">
          <span>Your conversations</span>
          <span className="text-indigo-500 cursor-pointer hover:text-indigo-600">Clear All</span>
        </div>
        <div className="space-y-1">
          {conversations.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all cursor-pointer text-gray-600 hover:bg-gray-50">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className="truncate">{item}</span>
            </div>
          ))}
          {conversations.length === 0 && (
            <div className="px-4 py-4 text-sm text-gray-400 italic text-center">
              No recent conversations
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-3">
        <button className="w-full flex items-center gap-3 px-6 py-3 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          Settings
        </button>
        <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-gray-200">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {/* Placeholder Avatar */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-700">Andrew Neilson</span>
        </div>
      </div>
    </aside>
  );
}
