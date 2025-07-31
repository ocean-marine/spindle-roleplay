import { useEffect, useRef, useState } from "react";
import logo from "../assets/openai-logomark.svg";
import SessionControls from "./SessionControls";
import ToolPanel from "./ToolPanel";

export default function App() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [events, setEvents] = useState([]);
  const [dataChannel, setDataChannel] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("alloy");
  const [instructions, setInstructions] = useState("");
  const peerConnection = useRef(null);
  const audioElement = useRef(null);

  const VOICE_OPTIONS = [
    "alloy",
    "ash", 
    "ballad",
    "coral",
    "echo",
    "sage",
    "shimmer",
    "verse"
  ];

  async function startSession() {
    // Get a session token for OpenAI Realtime API
    const tokenResponse = await fetch("/token");
    const data = await tokenResponse.json();
    const EPHEMERAL_KEY = data.client_secret.value;

    // Create a peer connection
    const pc = new RTCPeerConnection();

    // Set up to play remote audio from the model
    audioElement.current = document.createElement("audio");
    audioElement.current.autoplay = true;
    pc.ontrack = (e) => (audioElement.current.srcObject = e.streams[0]);

    // Add local audio track for microphone input in the browser
    const ms = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    pc.addTrack(ms.getTracks()[0]);

    // Set up data channel for sending and receiving events
    const dc = pc.createDataChannel("oai-events");
    setDataChannel(dc);

    // Start the session using the Session Description Protocol (SDP)
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const baseUrl = "https://api.openai.com/v1/realtime";
    const model = "gpt-4o-realtime-preview-2025-06-03";
    const sdpResponse = await fetch(`${baseUrl}?model=${model}&voice=${selectedVoice}`, {
      method: "POST",
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${EPHEMERAL_KEY}`,
        "Content-Type": "application/sdp",
      },
    });

    const answer = {
      type: "answer",
      sdp: await sdpResponse.text(),
    };
    await pc.setRemoteDescription(answer);

    peerConnection.current = pc;
  }

  // Stop current session, clean up peer connection and data channel
  function stopSession() {
    if (dataChannel) {
      dataChannel.close();
    }

    peerConnection.current.getSenders().forEach((sender) => {
      if (sender.track) {
        sender.track.stop();
      }
    });

    if (peerConnection.current) {
      peerConnection.current.close();
    }

    setIsSessionActive(false);
    setDataChannel(null);
    peerConnection.current = null;
  }

  // Send a message to the model
  function sendClientEvent(message) {
    if (dataChannel) {
      const timestamp = new Date().toLocaleTimeString();
      message.event_id = message.event_id || crypto.randomUUID();

      // send event before setting timestamp since the backend peer doesn't expect this field
      dataChannel.send(JSON.stringify(message));

      // if guard just in case the timestamp exists by miracle
      if (!message.timestamp) {
        message.timestamp = timestamp;
      }
      setEvents((prev) => [message, ...prev]);
    } else {
      console.error(
        "Failed to send message - no data channel available",
        message,
      );
    }
  }

  // Send a text message to the model
  function sendTextMessage(message) {
    const event = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: message,
          },
        ],
      },
    };

    sendClientEvent(event);
    sendClientEvent({ type: "response.create" });
  }

  // Attach event listeners to the data channel when a new one is created
  useEffect(() => {
    if (dataChannel) {
      // Append new server events to the list
      dataChannel.addEventListener("message", (e) => {
        const event = JSON.parse(e.data);
        if (!event.timestamp) {
          event.timestamp = new Date().toLocaleTimeString();
        }

        setEvents((prev) => [event, ...prev]);
      });

      // Set session active when the data channel is opened
      dataChannel.addEventListener("open", () => {
        setIsSessionActive(true);
        setEvents([]);
        
        // Send initial instructions if provided
        if (instructions.trim()) {
          setTimeout(() => {
            sendClientEvent({
              type: "conversation.item.create",
              item: {
                type: "message",
                role: "system",
                content: [{
                  type: "input_text",
                  text: instructions
                }]
              }
            });
          }, 500);
        }
      });
    }
  }, [dataChannel, instructions]);

  return (
    <>
      <nav className="absolute top-0 left-0 right-0 h-16 flex items-center z-20">
        <div className="flex items-center justify-between w-full m-4 pb-2 border-0 border-b border-solid border-gray-200">
          <div className="flex items-center gap-4">
            <img style={{ width: "24px" }} src={logo} />
            <h1 className="text-sm md:text-base">realtime console</h1>
          </div>
          <button
            className="md:hidden p-2 rounded-md bg-gray-100 hover:bg-gray-200"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </nav>
      <main className="absolute top-16 left-0 right-0 bottom-0">
        {/* Main conversation area */}
        <section className={`absolute top-0 left-0 bottom-0 flex ${showSidebar ? 'right-0 hidden md:right-[380px] md:flex' : 'right-0 md:right-[380px]'}`}>
          {!isSessionActive ? (
            <section className="absolute top-0 left-0 right-0 bottom-0 p-4 md:p-8 overflow-y-auto">
              <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">Session Settings</h1>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Voice Options</h2>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Select Voice</label>
                      <select
                        value={selectedVoice}
                        onChange={(e) => setSelectedVoice(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-sm"
                      >
                        {VOICE_OPTIONS.map((voice) => (
                          <option key={voice} value={voice}>
                            {voice}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Instructions</h2>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">System Instructions (Optional)</label>
                      <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="Enter system instructions for the AI assistant..."
                        className="w-full p-3 border border-gray-300 rounded-md text-sm resize-vertical"
                        rows={4}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        These instructions will be sent to the AI when the session starts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="absolute top-0 left-0 right-0 bottom-0 p-4 md:p-8 overflow-y-auto">
              <div className="max-w-2xl mx-auto text-center py-16">
                <h1 className="text-2xl md:text-3xl font-bold mb-4">Session Active</h1>
                <p className="text-gray-600 mb-8">Use voice to communicate with the AI assistant.</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800">🎤 Listening... Speak to interact with the AI</p>
                </div>
              </div>
            </section>
          )}
          <section className="absolute h-20 md:h-32 left-0 right-0 bottom-0 p-2 md:p-4">
            <SessionControls
              startSession={startSession}
              stopSession={stopSession}
              sendClientEvent={sendClientEvent}
              sendTextMessage={sendTextMessage}
              events={events}
              isSessionActive={isSessionActive}
            />
          </section>
        </section>
        
        {/* Mobile sidebar overlay */}
        {showSidebar && (
          <div className="md:hidden absolute inset-0 z-10">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowSidebar(false)}
            />
            <section className="absolute top-0 right-0 bottom-0 w-80 bg-white p-4 pt-0 overflow-y-auto shadow-lg">
              <div className="sticky top-0 bg-white pb-2 mb-4 border-b">
                <button
                  className="p-2 rounded-md hover:bg-gray-100 float-right"
                  onClick={() => setShowSidebar(false)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
                <div className="clear-both"></div>
              </div>
              <ToolPanel
                sendClientEvent={sendClientEvent}
                sendTextMessage={sendTextMessage}
                events={events}
                isSessionActive={isSessionActive}
                selectedVoice={selectedVoice}
              />
            </section>
          </div>
        )}
        
        {/* Desktop sidebar */}
        <section className="hidden md:block absolute top-0 w-[380px] right-0 bottom-0 p-4 pt-0 overflow-y-auto">
          <ToolPanel
            sendClientEvent={sendClientEvent}
            sendTextMessage={sendTextMessage}
            events={events}
            isSessionActive={isSessionActive}
            selectedVoice={selectedVoice}
          />
        </section>
      </main>
    </>
  );
}
