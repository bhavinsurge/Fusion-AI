// src/components/UI/UpgradeTab.tsx
export default function UpgradeTab() {
    return (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center z-30 pointer-events-none">
            <div className="bg-[#6366F1] text-white py-8 px-2 rounded-l-2xl shadow-lg cursor-pointer hover:pr-4 transition-all">
                <div className="font-bold text-[10px] uppercase tracking-widest flex flex-col items-center gap-4">
                    <span>✨</span>
                    <span className="rotate-180" style={{ writingMode: 'vertical-rl' }}>Upgrade to Pro</span>
                </div>
            </div>
        </div>
    );
}
