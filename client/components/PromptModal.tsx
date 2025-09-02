import { useState, useEffect } from "react";
import { X, Play, Volume2, Headphones, Save, Download, AlertCircle } from "react-feather";
import Button from "./Button";
import { getVoiceDescription } from "../utils/voiceSelection";
import customPromptsService from "../services/customPrompts";
import type { VoiceOption } from "../types";
import type { CustomPromptData } from "../services/customPrompts";

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptText: string;
  onStartSession: (editedPrompt?: string) => void;
  hasSettingsChanges?: boolean;
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  VOICE_OPTIONS?: VoiceOption[];
}

export default function PromptModal({ 
  isOpen, 
  onClose, 
  promptText, 
  onStartSession,
  hasSettingsChanges = true,
  selectedVoice,
  setSelectedVoice,
  VOICE_OPTIONS = []
}: PromptModalProps) {
  const [editedPrompt, setEditedPrompt] = useState("");
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [testAudio, setTestAudio] = useState<HTMLAudioElement | null>(null);
  const [savedPrompt, setSavedPrompt] = useState<CustomPromptData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

  // Load saved prompt when modal opens
  useEffect(() => {
    if (isOpen) {
      loadSavedPrompt();
    }
  }, [isOpen]);

  // Load saved custom prompt
  const loadSavedPrompt = async () => {
    setIsLoading(true);
    try {
      const prompt = await customPromptsService.getCustomPrompt();
      setSavedPrompt(prompt);
    } catch (error) {
      console.error('Error loading saved prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save current prompt to Edge Config
  const savePrompt = async () => {
    if (!editedPrompt.trim()) return;
    
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const savedData = await customPromptsService.saveOrUpdateCustomPrompt(editedPrompt);
      setSavedPrompt(savedData);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving prompt:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // Load saved prompt into editor
  const loadPrompt = () => {
    if (savedPrompt) {
      setEditedPrompt(savedPrompt.content);
    }
  };

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
      alert('音声テストに失敗しました: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 pr-2">
            {hasSettingsChanges ? '生成されたプロンプト' : 'カスタム指示入力'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 max-h-[calc(90vh-80px)] sm:max-h-[calc(85vh-80px)] overflow-y-auto">
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

          {/* Custom Prompt Management */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Save size={16} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-800">カスタムプロンプト</span>
              </div>
              {isLoading && (
                <div className="text-xs text-gray-500">読み込み中...</div>
              )}
            </div>

            {/* Save/Load Status */}
            {saveStatus === 'success' && (
              <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-700">プロンプトが保存されました</span>
                </div>
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2">
                  <AlertCircle size={12} className="text-red-500" />
                  <span className="text-xs text-red-700">保存に失敗しました</span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={savePrompt}
                disabled={isSaving || !editedPrompt.trim()}
                className="flex items-center gap-2 px-3 py-2 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={12} />
                {isSaving ? '保存中...' : '保存'}
              </button>
              
              {savedPrompt && (
                <button
                  onClick={loadPrompt}
                  className="flex items-center gap-2 px-3 py-2 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Download size={12} />
                  読み込み
                </button>
              )}
            </div>

            {savedPrompt && (
              <div className="mt-2 text-xs text-gray-500">
                最終更新: {new Date(savedPrompt.updatedAt).toLocaleString('ja-JP')}
              </div>
            )}
          </div>
          
          <div className="mb-4 sm:mb-6">
            <textarea
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
              className="w-full h-40 sm:h-48 p-3 sm:p-4 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              placeholder={hasSettingsChanges 
                ? 'プロンプトを入力してください...' 
                : 'AIアシスタントへのカスタム指示を入力してください...'
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <Button
              onClick={() => onStartSession(editedPrompt)}
              className="flex-1 bg-green-600 hover:bg-green-700 py-2.5 sm:py-3"
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