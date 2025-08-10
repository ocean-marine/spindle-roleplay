import { useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/openai-logomark.svg";
import TabNavigation from "./TabNavigation";
import SetupScreen from "./SetupScreen";
import VoiceInterface from "./VoiceInterface";
import ChatInterface from "./ChatInterface";
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
  const [selectedVoice, setSelectedVoice] = useState("");
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
  const [isMuted, setIsMuted] = useState(false);
  const peerConnection = useRef(null);
  const audioElement = useRef(null);
  const microphoneTrack = useRef(null);

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
    try {
      // Get a session token for OpenAI Realtime API, sending voice and persona data
      const tokenResponse = await fetch("/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          presetVoice: selectedVoice,
          persona: personaSettings,
        }),
      });
      
      if (!tokenResponse.ok) {
        throw new Error(`認証に失敗しました: ${tokenResponse.status}`);
      }
      
      const data = await tokenResponse.json();
      const EPHEMERAL_KEY = data.client_secret?.value || data.client_secret;
      
      if (!EPHEMERAL_KEY) {
        throw new Error("認証トークンの取得に失敗しました");
      }

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
    const track = ms.getTracks()[0];
    microphoneTrack.current = track;
    pc.addTrack(track);

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

    if (!sdpResponse.ok) {
      throw new Error(`セッション開始に失敗しました: ${sdpResponse.status} ${sdpResponse.statusText}`);
    }

    const answerSdp = await sdpResponse.text();
    
    if (!answerSdp || !answerSdp.startsWith('v=')) {
      throw new Error(`無効なSDP応答: ${answerSdp.substring(0, 100)}`);
    }

    const answer = {
      type: "answer",
      sdp: answerSdp,
    };
    
    try {
      await pc.setRemoteDescription(answer);
    } catch (error) {
      throw new Error(`セッションの開始に失敗しました: ${error.message}`);
    }

    peerConnection.current = pc;
    } catch (error) {
      console.error('セッション開始エラー:', error);
      alert(`セッションの開始に失敗しました: ${error.message}`);
      
      // クリーンアップ
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
      if (microphoneTrack.current) {
        microphoneTrack.current.stop();
        microphoneTrack.current = null;
      }
    }
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
    microphoneTrack.current = null;
    setIsMuted(false);
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

    // // Add persona settings
    // const personaInstructions = [];
    // if (personaSettings.age) personaInstructions.push(`年齢: ${personaSettings.age}`);
    // if (personaSettings.gender) personaInstructions.push(`性別: ${personaSettings.gender}`);
    // if (personaSettings.occupation) personaInstructions.push(`職業: ${personaSettings.occupation}`);
    // if (personaSettings.personality) personaInstructions.push(`パーソナリティ: ${personaSettings.personality}`);
    // if (personaSettings.additionalInfo) personaInstructions.push(`追加情報: ${personaSettings.additionalInfo}`);

    // if (personaInstructions.length > 0) {
    //   combined.push(`あなたのペルソナ設定:\n${personaInstructions.join('\n')}`);
    // }

    // // Add scene settings
    // const sceneInstructions = [];
    // if (sceneSettings.appointmentBackground) sceneInstructions.push(`アポイントメントの背景: ${sceneSettings.appointmentBackground}`);
    // if (sceneSettings.relationship) sceneInstructions.push(`相手との関係性: ${sceneSettings.relationship}`);
    // if (sceneSettings.timeOfDay) sceneInstructions.push(`時間帯: ${sceneSettings.timeOfDay}`);
    // if (sceneSettings.location) sceneInstructions.push(`場所: ${sceneSettings.location}`);
    // if (sceneSettings.additionalInfo) sceneInstructions.push(`追加情報: ${sceneSettings.additionalInfo}`);

    // if (sceneInstructions.length > 0) {
    //   combined.push(`シーン設定:\n${sceneInstructions.join('\n')}`);
    // }

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
        console.log("Combined Instructions:", combinedInstructions);
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



  // Stop session and switch to setup route
  const handleStopSession = () => {
    stopSession();
    navigate("/setup");
  };

  // Toggle mute/unmute functionality
  const toggleMute = () => {
    if (microphoneTrack.current) {
      microphoneTrack.current.enabled = !microphoneTrack.current.enabled;
      setIsMuted(!microphoneTrack.current.enabled);
    }
  };


  // 認証されていない場合はログイン画面を表示
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header - Apple-inspired minimal design */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-medium text-gray-900">Spindle AX</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{currentUser}</span>
            
            {/* Minimal session indicator */}
            <div className={`w-2 h-2 rounded-full ${
              isSessionActive ? 'bg-green-500' : 'bg-gray-300'
            }`} />
            
            {/* Clean logout button */}
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
      </nav>

      {/* Main content area - Clean and minimal */}
      <div className="flex-1">
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
                isMuted={isMuted}
                toggleMute={toggleMute}
                isListening={isListening}
                isSpeaking={isSpeaking}
                audioLevel={audioLevel}
                personaSettings={personaSettings}
                sceneSettings={sceneSettings}
                purpose={purpose}
                onStopSession={handleStopSession}
              />
            } 
          />
        </Routes>
      </div>
    </div>
  );
}
