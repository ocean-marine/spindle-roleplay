import { Settings, MessageCircle, History, Sliders } from "react-feather";

const TABS = [
  { id: 'setup', label: 'Setup', icon: Sliders },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'history', label: 'History', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export default function TabNavigation({ activeTab, onTabChange, className = "" }) {
  return (
    <nav className={`flex bg-white border-t border-gray-200 shadow-lg ${className}`}>
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 min-h-[60px] transition-colors ${
            activeTab === id
              ? 'text-blue-600 bg-blue-50 border-t-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <Icon size={20} className="mb-1" />
          <span className="text-xs font-medium">{label}</span>
        </button>
      ))}
    </nav>
  );
}