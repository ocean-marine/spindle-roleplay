import { useState, useRef, useEffect } from "react";
import { Send, User, MessageCircle } from "react-feather";

function MessageBubble({ message, isUser, timestamp }) {
  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-blue-500' : 'bg-gray-500'
      }`}>
        {isUser ? <User size={16} className="text-white" /> : <MessageCircle size={16} className="text-white" />}
      </div>
      
      {/* Message bubble */}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`rounded-2xl px-4 py-2 break-words ${
          isUser 
            ? 'bg-blue-500 text-white rounded-br-md' 
            : 'bg-gray-200 text-gray-800 rounded-bl-md'
        }`}>
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
        
        {/* Timestamp */}
        {timestamp && (
          <span className="text-xs text-gray-500 mt-1 px-1">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0">
        <MessageCircle size={16} className="text-white" />
      </div>
      <div className="bg-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Chat Inactive</h2>
        <p className="text-gray-600">Start a session to begin chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <MessageCircle size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">AI Assistant</h3>
            <p className="text-xs text-green-600">Online</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">No messages yet</p>
            <p className="text-sm text-gray-400">Send a message to start the conversation</p>
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

      {/* Input area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-2 items-end">
          <div className="flex-1 min-w-0">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-3 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`p-3 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors ${
              message.trim()
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
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