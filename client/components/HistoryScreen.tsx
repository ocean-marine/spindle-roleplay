import { useState } from "react";
import { Clock, MessageSquare, Trash2, Search, Filter, ChevronRight } from "react-feather";
import type { RealtimeEvent } from "../types";

interface EventCardProps {
  event: RealtimeEvent;
  onClick: () => void;
}

function EventCard({ event, onClick }: EventCardProps) {
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'conversation.item.create': return 'text-blue-600 bg-blue-50';
      case 'response.done': return 'text-green-600 bg-green-50';
      case 'session.created': return 'text-purple-600 bg-purple-50';
      case 'session.updated': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'conversation.item.create':
      case 'response.done':
        return <MessageSquare size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getEventDescription = (event: RealtimeEvent) => {
    switch (event.type) {
      case 'conversation.item.create':
        if (event.item?.content?.[0]?.text) {
          return event.item.content[0].text.substring(0, 60) + '...';
        }
        return 'メッセージ作成';
      case 'response.done':
        if (event.response?.output?.[0]?.content?.[0]?.text) {
          return event.response.output[0].content[0].text.substring(0, 60) + '...';
        }
        return 'AI応答完了';
      case 'session.created':
        return 'セッション開始';
      case 'session.updated':
        return 'セッション設定更新';
      default:
        return event.type.replace(/[._]/g, ' ');
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`p-2 rounded-full ${getEventTypeColor(event.type)}`}>
            {getEventIcon(event.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-800 truncate">
              {event.type.replace(/[._]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {getEventDescription(event)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {event.timestamp}
            </p>
          </div>
        </div>
        <ChevronRight size={16} className="text-gray-400 flex-shrink-0 ml-2" />
      </div>
    </div>
  );
}

interface EventDetailModalProps {
  event: RealtimeEvent | null;
  onClose: () => void;
}

function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">イベント詳細</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">タイプ</label>
              <p className="text-gray-800">{event.type}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">タイムスタンプ</label>
              <p className="text-gray-800">{event.timestamp}</p>
            </div>
            
            {event.event_id && (
              <div>
                <label className="text-sm font-medium text-gray-600">イベントID</label>
                <p className="text-gray-800 text-xs font-mono">{event.event_id}</p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-gray-600">生データ</label>
              <pre className="text-xs bg-gray-100 p-3 rounded-md overflow-x-auto mt-1">
                {JSON.stringify(event, null, 2)}
              </pre>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

interface HistoryScreenProps {
  events?: RealtimeEvent[];
  onClearHistory: () => void;
}

export default function HistoryScreen({ events = [], onClearHistory }: HistoryScreenProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<RealtimeEvent | null>(null);

  // Get unique event types for filter
  const eventTypes = ["all", ...new Set(events.map(e => e.type))];

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = searchTerm === "" || 
      event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(event).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedEventType === "all" || event.type === selectedEventType;
    
    return matchesSearch && matchesType;
  });

  const handleClearHistory = () => {
    if (window.confirm('すべてのイベント履歴をクリアしてよろしいですか？この操作は元に戻せません。')) {
      onClearHistory?.();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-3 sm:p-4 xl:pr-[340px]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">イベント履歴</h1>
          {events.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 size={16} />
              <span className="text-sm">クリア</span>
            </button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="イベントを検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-600" />
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {eventTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'すべてのタイプ' : type.replace(/[._]/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 xl:pr-[340px]">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Clock size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">イベントが見つかりません</h3>
            <p className="text-gray-600 mb-4">
              {events.length === 0 
                ? "イベント履歴を見るにはセッションを開始してください" 
                : "検索やフィルター条件を調整してみてください"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                {filteredEvents.length} 件のイベントが見つかりました
              </p>
            </div>
            
            {filteredEvents.map((event, index) => (
              <EventCard
                key={event.event_id || `event-${index}`}
                event={event}
                onClick={() => setSelectedEvent(event)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}