import { User, MessageCircle, Clock, Sliders } from "react-feather";
import { Link, useLocation } from "react-router-dom";

const TABS = [
  { id: 'setup', label: 'セットアップ', icon: Sliders, path: '/setup' },
  { id: 'chat', label: 'チャット', icon: MessageCircle, path: '/roleplay' },
  { id: 'history', label: '履歴', icon: Clock, path: '/history' },
  { id: 'settings', label: '設定', icon: User, path: '/settings' }
];

export default function TabNavigation({ className = "" }) {
  const location = useLocation();
  
  return (
    <nav className={`flex bg-white border-t border-gray-200 shadow-lg ${className}`}>
      {TABS.map(({ id, label, icon: Icon, path }) => {
        const isActive = location.pathname === path || 
          (path === '/setup' && location.pathname === '/');
        
        return (
          <Link
            key={id}
            to={path}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 min-h-[56px] sm:min-h-[60px] transition-colors ${
              isActive
                ? 'text-blue-600 bg-blue-50 border-t-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Icon size={18} className="sm:w-5 sm:h-5 mb-1" />
            <span className="text-xs font-medium leading-tight">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}