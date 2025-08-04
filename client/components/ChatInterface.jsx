import { useState, useRef, useEffect } from "react";
import { Send, User, MessageCircle } from "react-feather";

function MessageBubble({ message, isUser, timestamp }) {
  return (
    <div className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
        isUser ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-purple-500 to-purple-600'
      }`}>
        {isUser ? <User size={18} className="text-white" /> : <MessageCircle size={18} className="text-white" />}
      </div>
      
      {/* Message bubble */}
      <div className={`max-w-[75%] min-w-0 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`rounded-2xl px-4 py-3 break-words word-wrap overflow-wrap-anywhere shadow-sm ${
          isUser 
            ? 'bg-blue-500 text-white rounded-br-sm' 
            : 'bg-gray-100 text-gray-900 rounded-bl-sm border border-gray-200'
        }`}>
          <p className="text-sm leading-relaxed break-words">{message}</p>
        </div>
        
        {/* Timestamp */}
        {timestamp && (
          <span className="text-xs text-gray-400 mt-1 px-2">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-6">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
        <MessageCircle size={18} className="text-white" />
      </div>
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 border border-gray-200 shadow-sm">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}

export default function ChatInterface({ 
  events = [], 
  sendTextMessage, 
  isSessionActive,
  isTyping = false 
}) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [events, isTyping]);

  // Convert events to chat messages
  const messages = events
    .filter(event => 
      (event.type === 'conversation.item.create' && event.item?.content) ||
      (event.type === 'response.done' && event.response?.output)
    )
    .map(event => {
      if (event.type === 'conversation.item.create' && event.item?.content) {
        const content = event.item.content[0];
        return {
          id: event.event_id || crypto.randomUUID(),
          message: content.text || content.input_text || 'Message sent',
          isUser: event.item.role === 'user',
          timestamp: event.timestamp
        };
      } else if (event.type === 'response.done' && event.response?.output) {
        const textOutputs = event.response.output
          .filter(output => output.type === 'message' && output.content)
          .map(output => output.content
            .filter(content => content.type === 'text')
            .map(content => content.text)
            .join(' ')
          )
          .filter(text => text.length > 0);
        
        return textOutputs.map(text => ({
          id: event.event_id + '_' + crypto.randomUUID(),
          message: text,
          isUser: false,
          timestamp: event.timestamp
        }));
      }
      return null;
    })
    .flat()
    .filter(Boolean)
    .reverse(); // Show newest messages at bottom

  const handleSendMessage = () => {
    if (!message.trim() || !isSessionActive) return;
    
    sendTextMessage(message);
    setMessage("");
    
    // Focus back to input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isSessionActive) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <MessageCircle size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">チャット停止中</h2>
        <p className="text-gray-600">セッションを開始してチャットを始めましょう</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-white flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSessionActive ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gray-400'
          } shadow-md`}>
            <MessageCircle size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AIキャラクター</h3>
            <p className={`text-xs flex items-center gap-1 ${
              isSessionActive ? 'text-green-600' : 'text-gray-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isSessionActive ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              {isSessionActive ? 'オンライン' : 'オフライン'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-20">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">まだメッセージがありません</p>
            <p className="text-sm text-gray-400">メッセージを送信して会話を始めましょう</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg.message}
              isUser={msg.isUser}
              timestamp={msg.timestamp}
            />
          ))
        )}
        
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area - Fixed at bottom */}
      <div className="fixed bottom-16 left-0 right-0 border-t border-gray-100 p-4 bg-white safe-area-bottom z-10 shadow-lg">
        <div className="flex gap-2 items-end">
          <div className="flex-1 min-w-0">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="メッセージを入力..."
              className="w-full p-4 border border-gray-200 rounded-3xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 text-sm overflow-hidden shadow-sm bg-gray-50 focus:bg-white transition-colors"
              rows={1}
              style={{ 
                minHeight: '48px', 
                maxHeight: '120px',
                lineHeight: '1.5',
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`p-3 rounded-full min-h-[48px] min-w-[48px] flex items-center justify-center transition-all flex-shrink-0 shadow-sm ${
              message.trim()
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}