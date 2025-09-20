import { useState } from "react";
import { Play, BarChart } from "react-feather";
import { Link } from "react-router-dom";
import Button from "./Button";
import groqService from "../services/groq";
import PromptModal from "./PromptModal";
import PresetSelector from "./PresetSelector";
import type { 
  SetupScreenProps, 
  ViewMode, 
  ImmersionLevel,
  PresetData
} from "../types";


export default function SetupScreen({ 
  selectedVoice, 
  setSelectedVoice, 
  instructions: _instructions, 
  setInstructions,
  purpose,
  setPurpose,
  personaSettings,
  setPersonaSettings,
  sceneSettings,
  setSceneSettings,
  startSession,
  VOICE_OPTIONS,
  currentUser
}: SetupScreenProps): React.JSX.Element {
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [showPromptModal, setShowPromptModal] = useState<boolean>(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("preset");
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [customInstructions, setCustomInstructions] = useState<string>("");
  const immersionLevel: ImmersionLevel = "high"; // Always set to high as requested

  // Check if persona and scene settings have been changed from defaults
  const hasPersonaChanges = (): boolean => {
    return !!(personaSettings.age || personaSettings.gender || personaSettings.occupation || 
           personaSettings.personality || personaSettings.additionalInfo);
  };

  const hasSceneChanges = (): boolean => {
    return !!(sceneSettings.appointmentBackground || sceneSettings.relationship || 
           sceneSettings.timeOfDay || sceneSettings.location || sceneSettings.additionalInfo);
  };


  const handleStartSession = async (editedPrompt?: string): Promise<void> => {
    try {
      // Update instructions with the edited prompt before starting session
      if (editedPrompt !== undefined) {
        setInstructions(editedPrompt);
      }
      await startSession();
      setShowPromptModal(false);
    } catch (error) {
      console.error('Failed to start session:', error);
      alert('セッションの開始に失敗しました');
    }
  };

  // プリセット選択時の処理
  const handlePresetSelect = async (preset: PresetData): Promise<void> => {
    if (!preset) return;
    
    setIsStarting(true);
    try {
      // プリセットの設定を適用
      setPurpose(preset.purpose);
      setPersonaSettings(preset.persona);
      setSceneSettings(preset.scene);
      setSelectedVoice(preset.voice || "alloy");
      
      // プリセットに predefinedInstructions がある場合はそれを使用、ない場合は従来通り生成
      let promptToUse = "";
      if (preset.predefinedInstructions) {
        promptToUse = preset.predefinedInstructions;
      } else {
        // 従来の動的生成（後方互換性のため）
        promptToUse = await groqService.generateImmersiveRoleplayPrompt(
          preset.persona, 
          preset.scene, 
          immersionLevel,
          preset.purpose
        );
      }
      
      setGeneratedPrompt(promptToUse);
      setShowPromptModal(true);
    } catch (error) {
      console.error('Failed to process preset:', error);
      alert(`プリセットの処理に失敗しました: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsStarting(false);
    }
  };

  // プリセットで直接開始（プロンプトモーダルを飛ばす）
  const handleDirectStart = async (preset: PresetData): Promise<void> => {
    if (!preset || !preset.predefinedInstructions) return;
    
    setIsStarting(true);
    try {
      // プリセットの設定を適用
      setPurpose(preset.purpose);
      setPersonaSettings(preset.persona);
      setSceneSettings(preset.scene);
      setSelectedVoice(preset.voice || "alloy");
      
      // 事前定義されたインストラクションを直接使用
      setInstructions(preset.predefinedInstructions);
      
      // セッションを直接開始
      await startSession();
    } catch (error) {
      console.error('Failed to start direct session:', error);
      alert(`セッションの開始に失敗しました: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsStarting(false);
    }
  };

  // カスタマイズモードへの切り替え
  const handleCustomize = (preset: PresetData | null = null): void => {
    if (preset) {
      // プリセットを適用してからカスタマイズモードに
      setPurpose(preset.purpose);
      setPersonaSettings(preset.persona);
      setSceneSettings(preset.scene);
      setSelectedVoice(preset.voice || "ash");
    } else {
      // カスタマイズモードのデフォルト設定
      setSelectedVoice("ash");
      setPersonaSettings({
        age: "",
        gender: "",
        occupation: "",
        personality: "",
        additionalInfo: "",
        image: "👤" // 適当なアイコン
      });
    }
    setViewMode("custom");
  };

  // カスタマイズモードでの開始処理
  const handleCustomStart = async (): Promise<void> => {
    if (!customInstructions.trim()) {
      alert("プロンプトを入力してください");
      return;
    }
    
    setIsStarting(true);
    try {
      // テキストエリアの内容を直接instructionsに設定
      setInstructions(customInstructions);
      await startSession();
    } catch (error) {
      console.error('Failed to start custom session:', error);
      alert('セッションの開始に失敗しました');
    } finally {
      setIsStarting(false);
    }
  };


  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-white">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header - Clean and minimal */}
        <div className="text-center py-8 relative">
          {/* Admin Dashboard Link - Top Right */}
          {currentUser === "admin" && (
            <div className="absolute top-0 right-0">
              <Link
                to="/admin"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <BarChart size={16} />
                管理職ダッシュボード
              </Link>
            </div>
          )}
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">AIロールプレイ</h1>
        </div>

        {/* Mode Toggle - Apple-inspired segmented control */}
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setViewMode("preset")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              viewMode === "preset"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            プリセット
          </button>
          <button
            onClick={() => setViewMode("custom")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              viewMode === "custom"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            カスタマイズ
          </button>
        </div>

        {/* Content based on view mode */}
        {viewMode === "preset" ? (
          <PresetSelector
            onPresetSelect={handlePresetSelect}
            onCustomize={handleCustomize}
            onDirectStart={handleDirectStart}
            selectedPresetId={selectedPresetId || ""}
            setSelectedPresetId={setSelectedPresetId}
          />
        ) : (
          <>
            {/* カスタマイズモード - シンプルなテキストエリアと開始ボタンのみ */}
            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                カスタムプロンプト
              </label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="ロールプレイのプロンプトを入力してください。例: あなたは親切な店員です。お客様の質問に丁寧に答えてください。"
                className="w-full p-3 border border-gray-200 rounded-md text-sm resize-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none"
                rows={6}
              />
            </div>

            {/* カスタム開始ボタン */}
            <div className="pt-4">
              <Button
                onClick={handleCustomStart}
                disabled={isStarting || !customInstructions.trim()}
                className="w-full"
                icon={<Play size={18} />}
              >
                {isStarting ? 'セッション開始中...' : 'ロープレ開始'}
              </Button>
            </div>
          </>
        )}

        {/* Prompt Modal */}
        <PromptModal
          isOpen={showPromptModal}
          onClose={() => setShowPromptModal(false)}
          promptText={generatedPrompt}
          onStartSession={handleStartSession}
          hasSettingsChanges={hasPersonaChanges() || hasSceneChanges()}
          selectedVoice={selectedVoice}
          setSelectedVoice={setSelectedVoice}
          VOICE_OPTIONS={VOICE_OPTIONS}
        />
      </div>
    </div>
  );
}
