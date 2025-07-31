import { useState } from "react";
import { ChevronDown, ChevronUp, Play, Settings } from "react-feather";
import Button from "./Button";

function ExpandableSection({ title, children, defaultExpanded = false, icon: Icon }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={20} className="text-gray-600" />}
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronUp size={20} className="text-gray-400" />
        ) : (
          <ChevronDown size={20} className="text-gray-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
}

export default function SetupScreen({ 
  selectedVoice, 
  setSelectedVoice, 
  instructions, 
  setInstructions,
  startSession,
  VOICE_OPTIONS 
}) {
  const [isStarting, setIsStarting] = useState(false);

  const handleStartSession = async () => {
    setIsStarting(true);
    try {
      await startSession();
    } catch (error) {
      console.error('Failed to start session:', error);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Session Setup</h1>
          <p className="text-gray-600">Configure your AI voice assistant</p>
        </div>

        {/* Voice Selection */}
        <ExpandableSection 
          title="Voice Selection" 
          defaultExpanded={true}
          icon={Settings}
        >
          <div className="pt-3">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose AI Voice
            </label>
            <div className="grid grid-cols-2 gap-2">
              {VOICE_OPTIONS.map((voice) => (
                <button
                  key={voice}
                  onClick={() => setSelectedVoice(voice)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    selectedVoice === voice
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {voice}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Selected: <span className="font-medium">{selectedVoice}</span>
            </p>
          </div>
        </ExpandableSection>

        {/* Instructions */}
        <ExpandableSection 
          title="System Instructions" 
          defaultExpanded={false}
        >
          <div className="pt-3">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Custom Instructions (Optional)
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter instructions for the AI assistant..."
              className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-2">
              These instructions will guide the AI's behavior during the session.
            </p>
          </div>
        </ExpandableSection>

        {/* Session Info */}
        <ExpandableSection 
          title="Session Information" 
          defaultExpanded={false}
        >
          <div className="pt-3 space-y-3">
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-medium text-blue-800 mb-1">Features</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Real-time voice conversation</li>
                <li>• Text messaging support</li>
                <li>• Color palette generation tool</li>
                <li>• Session event logging</li>
              </ul>
            </div>
            
            <div className="bg-amber-50 rounded-lg p-3">
              <h4 className="font-medium text-amber-800 mb-1">Requirements</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Microphone access required</li>
                <li>• Stable internet connection</li>
                <li>• Modern browser with WebRTC support</li>
              </ul>
            </div>
          </div>
        </ExpandableSection>

        {/* Start Session Button */}
        <div className="pt-6">
          <Button
            onClick={handleStartSession}
            disabled={isStarting}
            className={`w-full py-4 text-base font-semibold ${
              isStarting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
            icon={<Play size={20} />}
          >
            {isStarting ? 'Starting Session...' : 'Start Voice Session'}
          </Button>
          
          <p className="text-center text-xs text-gray-500 mt-3">
            By starting a session, you agree to share audio data with OpenAI's Realtime API
          </p>
        </div>
      </div>
    </div>
  );
}