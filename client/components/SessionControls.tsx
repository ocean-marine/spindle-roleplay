import { useState } from "react";
import { CloudLightning, CloudOff, MessageSquare } from "react-feather";
import Button from "./Button";

function SessionStopped({ startSession }) {
  const [isActivating, setIsActivating] = useState(false);

  function handleStartSession() {
    if (isActivating) return;

    setIsActivating(true);
    startSession();
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Button
        onClick={handleStartSession}
        className={`text-sm md:text-base px-4 md:px-6 py-3 md:py-4 ${isActivating ? "bg-gray-600" : "bg-red-600"}`}
        icon={<CloudLightning height={16} />}
      >
        {isActivating ? "starting session..." : "start session"}
      </Button>
    </div>
  );
}

function SessionActive({ stopSession, sendTextMessage }) {
  const [message, setMessage] = useState("");

  function handleSendClientEvent() {
    sendTextMessage(message);
    setMessage("");
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full h-full gap-2 md:gap-4">
      <input
        onKeyDown={(e) => {
          if (e.key === "Enter" && message.trim()) {
            handleSendClientEvent();
          }
        }}
        type="text"
        placeholder="send a text message..."
        className="border border-gray-200 rounded-full p-3 md:p-4 flex-1 w-full md:w-auto text-sm md:text-base min-h-[44px]"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="flex gap-2 w-full md:w-auto">
        <Button
          onClick={() => {
            if (message.trim()) {
              handleSendClientEvent();
            }
          }}
          icon={<MessageSquare height={16} />}
          className="bg-blue-400 flex-1 md:flex-none px-3 md:px-4 py-3 text-sm md:text-base min-h-[44px]"
        >
          <span className="hidden md:inline">send text</span>
          <span className="md:hidden">send</span>
        </Button>
        <Button 
          onClick={stopSession} 
          icon={<CloudOff height={16} />}
          className="flex-1 md:flex-none px-3 md:px-4 py-3 text-sm md:text-base min-h-[44px]"
        >
          <span className="hidden md:inline">disconnect</span>
          <span className="md:hidden">end</span>
        </Button>
      </div>
    </div>
  );
}

export default function SessionControls({
  startSession,
  stopSession,
  sendClientEvent,
  sendTextMessage,
  serverEvents,
  isSessionActive,
}) {
  return (
    <div className="flex gap-4 border-t-2 border-gray-200 h-full rounded-md">
      {isSessionActive ? (
        <SessionActive
          stopSession={stopSession}
          sendClientEvent={sendClientEvent}
          sendTextMessage={sendTextMessage}
          serverEvents={serverEvents}
        />
      ) : (
        <SessionStopped startSession={startSession} />
      )}
    </div>
  );
}
