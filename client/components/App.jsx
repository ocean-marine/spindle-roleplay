import { useEffect, useRef, useState } from "react";
import logo from "../assets/openai-logomark.svg";
import TabNavigation from "./TabNavigation";
import SetupScreen from "./SetupScreen";
import VoiceInterface from "./VoiceInterface";
import ChatInterface from "./ChatInterface";
import HistoryScreen from "./HistoryScreen";
import SettingsScreen from "./SettingsScreen";
import SwipeHandler from "./SwipeHandler";
import PullToRefresh from "./PullToRefresh";
import SessionControls from "./SessionControls";
import ToolPanel from "./ToolPanel";

export default function App() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [events, setEvents] = useState([]);
  const [dataChannel, setDataChannel] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState("alloy");
  const [instructions, setInstructions] = useState("自然な日本語で応対します。");
  const [activeTab, setActiveTab] = useState("setup");
  
  // Persona settings
  const [personaSettings, setPersonaSettings] = useState({
    age: "",
    gender: "",
    occupation: "",
    personality: "",
    additionalInfo: ""
  });
  
  // Scene settings
  const [sceneSettings, setSceneSettings] = useState({
    appointmentBackground: "",
    relationship: "",
    timeOfDay: "",
    location: "",
    additionalInfo: ""
  });
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
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

  // Build combined instructions from persona and scene settings
  function buildCombinedInstructions() {
    let combined = [];

    // Add custom instructions if provided
    if (instructions.trim()) {
      combined.push(instructions.trim());
    }

    // Add persona settings
    const personaInstructions = [];
    if (personaSettings.age) personaInstructions.push(`年齢: ${personaSettings.age}`);
    if (personaSettings.gender) personaInstructions.push(`性別: ${personaSettings.gender}`);
    if (personaSettings.occupation) personaInstructions.push(`職業: ${personaSettings.occupation}`);
    if (personaSettings.personality) personaInstructions.push(`パーソナリティ: ${personaSettings.personality}`);
    if (personaSettings.additionalInfo) personaInstructions.push(`追加情報: ${personaSettings.additionalInfo}`);

    if (personaInstructions.length > 0) {
      combined.push(`あなたのペルソナ設定:\n${personaInstructions.join('\n')}`);
    }

    // Add scene settings
    const sceneInstructions = [];
    if (sceneSettings.appointmentBackground) sceneInstructions.push(`アポイントメントの背景: ${sceneSettings.appointmentBackground}`);
    if (sceneSettings.relationship) sceneInstructions.push(`相手との関係性: ${sceneSettings.relationship}`);
    if (sceneSettings.timeOfDay) sceneInstructions.push(`時間帯: ${sceneSettings.timeOfDay}`);
    if (sceneSettings.location) sceneInstructions.push(`場所: ${sceneSettings.location}`);
    if (sceneSettings.additionalInfo) sceneInstructions.push(`追加情報: ${sceneSettings.additionalInfo}`);

    if (sceneInstructions.length > 0) {
      combined.push(`シーン設定:\n${sceneInstructions.join('\n')}`);
    }

    return combined.join('\n\n');
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

        // Update UI states based on events
        if (event.type === 'input_audio_buffer.speech_started') {
          setIsListening(true);
          setIsSpeaking(false);
        } else if (event.type === 'input_audio_buffer.speech_stopped') {
          setIsListening(false);
        } else if (event.type === 'response.audio.delta' || event.type === 'response.audio_transcript.delta') {
          setIsSpeaking(true);
          setIsListening(false);
        } else if (event.type === 'response.done') {
          setIsSpeaking(false);
          setIsListening(false);
        }

        setEvents((prev) => [event, ...prev]);
      });

      // Set session active when the data channel is opened
      dataChannel.addEventListener("open", () => {
        setIsSessionActive(true);
        setEvents([]);
        setActiveTab("chat"); // Switch to chat tab when session starts
        
        // Send initial instructions if provided
        const combinedInstructions = buildCombinedInstructions();
        if (combinedInstructions.trim()) {
          setTimeout(() => {
            sendClientEvent({
              type: "conversation.item.create",
              item: {
                type: "message",
                role: "system",
                content: [{
                  type: "input_text",
                  text: combinedInstructions
                }]
              }
            });
          }, 500);
        }
      });
    }
  }, [dataChannel, instructions, personaSettings, sceneSettings]);

  // Handle tab switching with swipe gestures
  const handleSwipeLeft = () => {
    const tabs = ['setup', 'chat', 'history', 'settings'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handleSwipeRight = () => {
    const tabs = ['setup', 'chat', 'history', 'settings'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  // Handle pull to refresh for session management
  const handleRefresh = async () => {
    if (isSessionActive) {
      stopSession();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await startSession();
    }
    return Promise.resolve();
  };

  // Clear history function
  const handleClearHistory = () => {
    setEvents([]);
  };

  // Stop session and switch to setup tab
  const handleStopSession = () => {
    stopSession();
    setActiveTab("setup");
  };

  // Render current tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'setup':
        return (
          <SetupScreen
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
            instructions={instructions}
            setInstructions={setInstructions}
            personaSettings={personaSettings}
            setPersonaSettings={setPersonaSettings}
            sceneSettings={sceneSettings}
            setSceneSettings={setSceneSettings}
            startSession={startSession}
            VOICE_OPTIONS={VOICE_OPTIONS}
          />
        );
      
      case 'chat':
        return (
          <ChatInterface
            events={events}
            sendTextMessage={sendTextMessage}
            isSessionActive={isSessionActive}
            isTyping={isSpeaking}
          />
        );
      
      case 'history':
        return (
          <HistoryScreen
            events={events}
            onClearHistory={handleClearHistory}
          />
        );
      
      case 'settings':
        return (
          <SettingsScreen
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
            VOICE_OPTIONS={VOICE_OPTIONS}
            instructions={instructions}
            setInstructions={setInstructions}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img style={{ width: "24px" }} src={logo} alt="OpenAI Logo" />
            <div>
              <h1 className="text-base font-semibold text-gray-800">Realtime Console</h1>
              <p className="text-xs text-gray-500">Mobile Edition</p>
            </div>
          </div>
          
          {/* Session status indicator */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isSessionActive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {isSessionActive ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      </nav>

      {/* Main content area with swipe support */}
      <PullToRefresh
        onRefresh={isSessionActive ? handleRefresh : undefined}
        className="flex-1 relative"
      >
        <SwipeHandler
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          className="h-full"
        >
          <div className="h-full flex flex-col">
            {renderTabContent()}
          </div>
        </SwipeHandler>
      </PullToRefresh>

      {/* Tab Navigation */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="flex-shrink-0"
      />
      
      {/* Desktop tool panel (hidden on mobile) */}
      <div className="hidden lg:block fixed top-16 right-4 bottom-16 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Tools & Events</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ToolPanel
            sendClientEvent={sendClientEvent}
            sendTextMessage={sendTextMessage}
            events={events}
            isSessionActive={isSessionActive}
            selectedVoice={selectedVoice}
          />
        </div>
      </div>
    </div>
  );
}
