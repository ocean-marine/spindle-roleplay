import { useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/openai-logomark.svg";
import TabNavigation from "./TabNavigation";
import SetupScreen from "./SetupScreen";
import VoiceInterface from "./VoiceInterface";
import ChatInterface from "./ChatInterface";
import HistoryScreen from "./HistoryScreen";
import SettingsScreen from "./SettingsScreen";
import SessionControls from "./SessionControls";
import ToolPanel from "./ToolPanel";
import LoginScreen from "./LoginScreen";
import { checkAuthStatus, logout } from "../utils/auth";

export default function App() {
  // 認証状態管理
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [events, setEvents] = useState([]);
  const [dataChannel, setDataChannel] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState("alloy");
  const [instructions, setInstructions] = useState("自然な日本語で応対します。");
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Purpose setting
  const [purpose, setPurpose] = useState("");
  
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
    "nova",
    "echo",
    "fable",
    "onyx",
    "shimmer"
  ];

  // 認証関連の処理
  useEffect(() => {
    // アプリ起動時に認証状態をチェック
    checkAuthStatus().then((authStatus) => {
      if (authStatus) {
        setIsAuthenticated(true);
        setCurrentUser(authStatus.accountName);
      }
    });
  }, []);

  const handleLogin = (accountName) => {
    setIsAuthenticated(true);
    setCurrentUser(accountName);
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    // セッションが有効な場合は停止
    if (isSessionActive) {
      stopSession();
    }
  };

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
        navigate("/roleplay"); // Switch to roleplay route when session starts
        
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
  }, [dataChannel, instructions, personaSettings, sceneSettings, purpose, navigate]);


  // Clear history function
  const handleClearHistory = () => {
    setEvents([]);
  };

  // Stop session and switch to setup route
  const handleStopSession = () => {
    stopSession();
    navigate("/setup");
  };


  // 認証されていない場合はログイン画面を表示
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 px-3 sm:px-4 py-3 flex-shrink-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img style={{ width: "20px" }} className="sm:w-6 flex-shrink-0" src={logo} alt="OpenAI Logo" />
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-semibold text-gray-800 truncate">Realtime Console</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Mobile Edition</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            {/* User info - hide on very small screens */}
            <span className="hidden xs:block text-xs text-gray-600 truncate max-w-20 sm:max-w-none">{currentUser}</span>
            
            {/* Session status indicator */}
            <div className={`px-1 sm:px-2 py-1 rounded-full text-xs font-medium ${
              isSessionActive 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              <span className="hidden sm:inline">{isSessionActive ? 'Connected' : 'Disconnected'}</span>
              <span className="sm:hidden">{isSessionActive ? '●' : '○'}</span>
            </div>
            
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="text-xs text-gray-500 hover:text-gray-700 px-1 sm:px-2 py-1 rounded hover:bg-gray-100 flex-shrink-0"
            >
              <span className="hidden sm:inline">ログアウト</span>
              <span className="sm:hidden">出</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <div className="flex-1 relative">
        <div className="h-full flex flex-col">
          <Routes>
            <Route path="/" element={<Navigate to="/setup" replace />} />
            <Route 
              path="/setup" 
              element={
                <SetupScreen
                  selectedVoice={selectedVoice}
                  setSelectedVoice={setSelectedVoice}
                  instructions={instructions}
                  setInstructions={setInstructions}
                  purpose={purpose}
                  setPurpose={setPurpose}
                  personaSettings={personaSettings}
                  setPersonaSettings={setPersonaSettings}
                  sceneSettings={sceneSettings}
                  setSceneSettings={setSceneSettings}
                  startSession={startSession}
                  VOICE_OPTIONS={VOICE_OPTIONS}
                />
              } 
            />
            <Route 
              path="/roleplay" 
              element={
                <ChatInterface
                  events={events}
                  sendTextMessage={sendTextMessage}
                  isSessionActive={isSessionActive}
                  isTyping={isSpeaking}
                />
              } 
            />
            <Route 
              path="/history" 
              element={
                <HistoryScreen
                  events={events}
                  onClearHistory={handleClearHistory}
                />
              } 
            />
            <Route 
              path="/settings" 
              element={
                <SettingsScreen
                  selectedVoice={selectedVoice}
                  setSelectedVoice={setSelectedVoice}
                  VOICE_OPTIONS={VOICE_OPTIONS}
                  instructions={instructions}
                  setInstructions={setInstructions}
                />
              } 
            />
          </Routes>
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigation className="flex-shrink-0" />
      
      {/* Desktop tool panel (hidden on mobile and tablet) */}
      <div className="hidden xl:block fixed top-16 right-4 bottom-20 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10">
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
