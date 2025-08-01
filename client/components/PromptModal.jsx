import { useState, useEffect } from "react";
import { X, Play, Volume2, Headphones } from "react-feather";
import Button from "./Button";
import { getVoiceDescription } from "../utils/voiceSelection";

export default function PromptModal({ 
  isOpen, 
  onClose, 
  promptText, 
  onStartSession,
  hasSettingsChanges = true,
  selectedVoice,
  setSelectedVoice,
  VOICE_OPTIONS = []
}) {
  const [editedPrompt, setEditedPrompt] = useState("");
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [testAudio, setTestAudio] = useState(null);

  // Update edited prompt when promptText changes
  useEffect(() => {
    setEditedPrompt(promptText);
  }, [promptText]);

  // Clean up audio when modal closes
  useEffect(() => {
    if (!isOpen && testAudio) {
      testAudio.pause();
      setTestAudio(null);
    }
  }, [isOpen, testAudio]);

  // Function to test voice
  const testVoice = async () => {
    if (!selectedVoice) return;
    
    setIsTestingVoice(true);
    
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voice: selectedVoice,
          text: 'こんにちは。この音声でAIアシスタントが話します。'
        }),
      });

      if (!response.ok) {
        throw new Error('音声生成に失敗しました');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      setTestAudio(audio);
      
      audio.onended = () => {
        setIsTestingVoice(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsTestingVoice(false);
        URL.revokeObjectURL(audioUrl);
        alert('音声の再生に失敗しました');
      };

      await audio.play();
    } catch (error) {
      console.error('Voice test error:', error);
      setIsTestingVoice(false);
      alert('音声テストに失敗しました: ' + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {hasSettingsChanges ? '生成されたプロンプト' : 'カスタム指示入力'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[calc(85vh-80px)] overflow-y-auto">
          <p className="text-sm text-gray-600 mb-4">
            {hasSettingsChanges 
              ? '生成されたロールプレイング用プロンプトを確認・編集して会話を始めます。このプロンプトはAIが完全にペルソナになりきるよう設計されています。' 
              : 'カスタム指示を入力して会話を始めます'
            }
          </p>

          {/* Voice Selection */}
          {selectedVoice && VOICE_OPTIONS.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-800">音声設定</span>
              </div>
              <div className="mb-2">
                <label className="block text-xs text-blue-700 mb-1">選択された音声</label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full text-sm border border-blue-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {VOICE_OPTIONS.map((voice) => (
                    <option key={voice} value={voice}>
                      {voice}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-blue-600">
                  {getVoiceDescription(selectedVoice)} | ペルソナ設定に基づいて自動選択されました
                </p>
                <button
                  onClick={testVoice}
                  disabled={isTestingVoice}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Headphones size={12} />
                  {isTestingVoice ? '再生中...' : '音声テスト'}
                </button>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <textarea
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
              className="w-full h-48 p-4 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              placeholder={hasSettingsChanges 
                ? 'プロンプトを入力してください...' 
                : 'AIアシスタントへのカスタム指示を入力してください...'
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <Button
              onClick={() => onStartSession(editedPrompt)}
              className="flex-1 bg-green-600 hover:bg-green-700"
              icon={<Play size={16} />}
            >
              会話を開始
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}