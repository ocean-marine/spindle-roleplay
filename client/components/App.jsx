import { useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { User, Settings, MessageCircle, Clock, LogOut } from "react-feather";
import logo from "../assets/openai-logomark.svg";
import SetupScreen from "./SetupScreen";
import ChatInterface from "./ChatInterface";
import HistoryScreen from "./HistoryScreen";
import SettingsScreen from "./SettingsScreen";
import LoginScreen from "./LoginScreen";
import { checkAuthStatus, logout } from "../utils/auth";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 認証状態管理
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [events, setEvents] = useState([]);
  const [dataChannel, setDataChannel] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState("alloy");
  const [instructions, setInstructions] = useState("自然な日本語で応対します。");
  
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
    navigate('/setup');
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    // セッションが有効な場合は停止
    if (isSessionActive) {
      stopSession();
    }
    navigate('/login');
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
        navigate('/roleplay'); // Navigate to roleplay when session starts
        
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

  // Stop session and navigate to setup
  const handleStopSession = () => {
    stopSession();
    navigate('/setup');
  };

  // Navigation items based on Character.ai style
  const navigationItems = [
    { path: '/setup', icon: Settings, label: 'セットアップ' },
    { path: '/roleplay', icon: MessageCircle, label: 'ロールプレイ' },
    { path: '/history', icon: Clock, label: '履歴' },
    { path: '/admin', icon: User, label: '管理' }
  ];

  // 認証されていない場合はログイン画面を表示
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<LoginScreen onLogin={handleLogin} />} />
        <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="h-screen bg-white flex">
      {/* Sidebar Navigation - Hidden on mobile */}
      <div className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col">
        {/* Logo and Brand */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <img className="w-8 h-8" src={logo} alt="OpenAI Logo" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Spindle</h1>
              <p className="text-sm text-gray-500">Roleplay Console</p>
            </div>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={18} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{currentUser}</p>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isSessionActive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {isSessionActive ? '接続中' : '切断済み'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">ログアウト</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img className="w-8 h-8" src={logo} alt="OpenAI Logo" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Spindle</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              isSessionActive 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {isSessionActive ? '接続中' : '切断済み'}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

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
                onStopSession={handleStopSession}
                isListening={isListening}
                isSpeaking={isSpeaking}
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
            path="/admin" 
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
          <Route path="*" element={<Navigate to="/setup" replace />} />
        </Routes>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 safe-area-bottom">
        <div className="flex justify-around">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                <span className="text-xs font-medium mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}