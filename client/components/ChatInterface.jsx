import { useState, useRef, useEffect } from "react";
import { Send, User, MessageCircle, Mic, MicOff, Square } from "react-feather";

function MessageBubble({ message, isUser, timestamp }) {
  return (
    <div className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-blue-500' : 'bg-gray-600'
      }`}>
        {isUser ? <User size={18} className="text-white" /> : <MessageCircle size={18} className="text-white" />}
      </div>
      
      {/* Message bubble */}
      <div className={`max-w-[70%] min-w-0 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`rounded-2xl px-4 py-3 break-words word-wrap overflow-wrap-anywhere ${
          isUser 
            ? 'bg-blue-500 text-white rounded-br-md' 
            : 'bg-gray-100 text-gray-800 rounded-bl-md border border-gray-200'
        }`}>
          <p className="text-sm leading-relaxed break-words">{message}</p>
        </div>
        
        {/* Timestamp */}
        {timestamp && (
          <span className="text-xs text-gray-400 mt-1 px-1">
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
      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
        <MessageCircle size={18} className="text-white" />
      </div>
      <div className="bg-gray-100 border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}

function AudioIndicator({ isListening, isSpeaking }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {isListening && (
        <div className="flex items-center gap-2 text-blue-600">
          <Mic size={16} />
          <span>聞き取り中...</span>
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-blue-400 rounded animate-pulse"></div>
            <div className="w-1 h-4 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-2 bg-blue-400 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}
      
      {isSpeaking && (
        <div className="flex items-center gap-2 text-green-600">
          <MessageCircle size={16} />
          <span>応答中...</span>
          <div className="flex gap-1">
            <div className="w-1 h-2 bg-green-400 rounded animate-pulse"></div>
            <div className="w-1 h-4 bg-green-500 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-3 bg-green-400 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatInterface({ 
  events = [], 
  sendTextMessage, 
  isSessionActive,
  isTyping = false,
  onStopSession,
  isListening = false,
  isSpeaking = false
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

  // Focus input when component mounts
  useEffect(() => {
    if (isSessionActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSessionActive]);

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
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <MessageCircle size={32} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">ロールプレイを開始</h2>
        <p className="text-gray-600 mb-4">セットアップ画面でセッションを開始してください</p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          セットアップに戻る
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Chat header - Character.ai style */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AIアシスタント</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-500">オンライン</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <AudioIndicator isListening={isListening} isSpeaking={isSpeaking} />
            <button
              onClick={onStopSession}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Square size={16} />
              <span className="text-sm font-medium">停止</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages area - Character.ai style */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-600 mb-2">会話を始めましょう</p>
            <p className="text-sm text-gray-400">音声で話すか、下のテキストボックスでメッセージを送信してください</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg.message}
                isUser={msg.isUser}
                timestamp={msg.timestamp}
              />
            ))}
            
            {isTyping && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area - Character.ai style with mobile spacing */}
      <div className="px-4 lg:px-6 py-4 border-t border-gray-200 bg-gray-50 pb-20 lg:pb-4">
        <div className="flex gap-3 items-end max-w-4xl mx-auto">
          <div className="flex-1 min-w-0">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="メッセージを入力してください..."
              className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm"
              rows={1}
              style={{ 
                minHeight: '56px', 
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
            className={`p-4 rounded-xl min-h-[56px] min-w-[56px] flex items-center justify-center transition-all shadow-sm ${
              message.trim()
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
        
        {/* Audio status indicator */}
        <div className="flex justify-center mt-3">
          <div className="text-xs text-gray-500">
            {isListening && "🎤 音声を聞き取り中..."}
            {isSpeaking && "🔊 AIが応答中..."}
            {!isListening && !isSpeaking && "マイクで話すか、テキストでメッセージを送信してください"}
          </div>
        </div>
      </div>
    </div>
  );
}