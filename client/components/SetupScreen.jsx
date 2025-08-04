import { useState } from "react";
import { ChevronDown, ChevronUp, Play, Settings, User, MapPin } from "react-feather";
import Button from "./Button";
import groqService from "../services/groq";
import PromptModal from "./PromptModal";
import { selectVoiceByRules } from "../utils/voiceSelection";
import PresetSelector from "./PresetSelector";

function ExpandableSection({ title, children, defaultExpanded = false, icon: Icon }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 sm:p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
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
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-gray-100">
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
  purpose,
  setPurpose,
  personaSettings,
  setPersonaSettings,
  sceneSettings,
  setSceneSettings,
  startSession,
  VOICE_OPTIONS 
}) {
  const [isStarting, setIsStarting] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [viewMode, setViewMode] = useState("preset"); // "preset" | "custom"
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const immersionLevel = "high"; // Always set to high as requested

  // Check if persona and scene settings have been changed from defaults
  const hasPersonaChanges = () => {
    return personaSettings.age || personaSettings.gender || personaSettings.occupation || 
           personaSettings.personality || personaSettings.additionalInfo;
  };

  const hasSceneChanges = () => {
    return sceneSettings.appointmentBackground || sceneSettings.relationship || 
           sceneSettings.timeOfDay || sceneSettings.location || sceneSettings.additionalInfo;
  };

  const handleGeneratePrompt = async () => {
    setIsStarting(true);
    try {
      // Auto-select voice based on persona settings
      const autoSelectedVoice = selectVoiceByRules(
        personaSettings.age, 
        personaSettings.gender, 
        VOICE_OPTIONS
      );
      setSelectedVoice(autoSelectedVoice);
      
      let promptToUse = "";
      const hasChanges = hasPersonaChanges() || hasSceneChanges();
      
      if (hasChanges) {
        // If persona/scene settings have changes, generate from settings
        const contextParts = [];
        
        // Add persona context
        const personaInfo = [];
        if (personaSettings.age) personaInfo.push(`年齢: ${personaSettings.age}`);
        if (personaSettings.gender) personaInfo.push(`性別: ${personaSettings.gender}`);
        if (personaSettings.occupation) personaInfo.push(`職業: ${personaSettings.occupation}`);
        if (personaSettings.personality) personaInfo.push(`パーソナリティ: ${personaSettings.personality}`);
        if (personaSettings.additionalInfo) personaInfo.push(`追加情報: ${personaSettings.additionalInfo}`);
        
        if (personaInfo.length > 0) {
          contextParts.push(`ペルソナ: ${personaInfo.join(', ')}`);
        }
        
        // Add scene context  
        const sceneInfo = [];
        if (sceneSettings.appointmentBackground) sceneInfo.push(`背景: ${sceneSettings.appointmentBackground}`);
        if (sceneSettings.relationship) sceneInfo.push(`関係性: ${sceneSettings.relationship}`);
        if (sceneSettings.timeOfDay) sceneInfo.push(`時間帯: ${sceneSettings.timeOfDay}`);
        if (sceneSettings.location) sceneInfo.push(`場所: ${sceneSettings.location}`);
        if (sceneSettings.additionalInfo) sceneInfo.push(`追加情報: ${sceneSettings.additionalInfo}`);
        
        if (sceneInfo.length > 0) {
          contextParts.push(`シーン: ${sceneInfo.join(', ')}`);
        }
        
        const context = contextParts.join('\n');
        
        if (context.trim()) {
          // Generate immersive roleplay prompt using enhanced system
          promptToUse = await groqService.generateImmersiveRoleplayPrompt(
            personaSettings, 
            sceneSettings, 
            immersionLevel,
            purpose
          );
        }
      }
      // If no changes, promptToUse remains empty and modal will show custom input
      
      setGeneratedPrompt(promptToUse);
      setShowPromptModal(true);
    } catch (error) {
      console.error('Failed to generate prompt:', error);
      alert(`プロンプトの生成に失敗しました: ${error.message}`);
    } finally {
      setIsStarting(false);
    }
  };

  const handleStartSession = async (editedPrompt) => {
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
  const handlePresetSelect = async (preset) => {
    if (!preset) return;
    
    setIsStarting(true);
    try {
      // プリセットの設定を適用
      setPurpose(preset.purpose);
      setPersonaSettings(preset.persona);
      setSceneSettings(preset.scene);
      setSelectedVoice(preset.voice);
      
      // プロンプトを生成
      const promptToUse = await groqService.generateImmersiveRoleplayPrompt(
        preset.persona, 
        preset.scene, 
        immersionLevel,
        preset.purpose
      );
      
      setGeneratedPrompt(promptToUse);
      setShowPromptModal(true);
    } catch (error) {
      console.error('Failed to process preset:', error);
      alert(`プリセットの処理に失敗しました: ${error.message}`);
    } finally {
      setIsStarting(false);
    }
  };

  // カスタマイズモードへの切り替え
  const handleCustomize = (preset = null) => {
    if (preset) {
      // プリセットを適用してからカスタマイズモードに
      setPurpose(preset.purpose);
      setPersonaSettings(preset.persona);
      setSceneSettings(preset.scene);
      setSelectedVoice(preset.voice);
    }
    setViewMode("custom");
  };


  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 xl:pr-[340px] bg-gray-50">
      <div className="max-w-md mx-auto space-y-3 sm:space-y-4 pb-4">
        {/* Header */}
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">AIロールプレイング</h1>
        </div>

        {/* Mode Toggle */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 flex">
          <button
            onClick={() => setViewMode("preset")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              viewMode === "preset"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            プリセット選択
          </button>
          <button
            onClick={() => setViewMode("custom")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              viewMode === "custom"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            詳細設定
          </button>
        </div>

        {/* Content based on view mode */}
        {viewMode === "preset" ? (
          <PresetSelector
            onPresetSelect={handlePresetSelect}
            onCustomize={handleCustomize}
            selectedPresetId={selectedPresetId}
            setSelectedPresetId={setSelectedPresetId}
          />
        ) : (
          <>
            {/* 既存のカスタム設定UI */}

        {/* Purpose Setting */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">目的</h2>
          </div>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="例: マンション購入契約、雑談、プレゼンテーションの練習など"
            className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />
        </div>

        {/* Persona Settings */}
        <ExpandableSection 
          title="ペルソナ" 
          defaultExpanded={false}
          icon={User}
        >
          <div className="pt-3 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                年齢
              </label>
              <select
                value={personaSettings.age}
                onChange={(e) => setPersonaSettings({...personaSettings, age: e.target.value})}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">選択してください</option>
                <option value="20代前半">20代前半</option>
                <option value="20代後半">20代後半</option>
                <option value="30代前半">30代前半</option>
                <option value="30代後半">30代後半</option>
                <option value="40代前半">40代前半</option>
                <option value="40代後半">40代後半</option>
                <option value="50代前半">50代前半</option>
                <option value="50代後半">50代後半</option>
                <option value="60代前半">60代前半</option>
                <option value="60代後半">60代後半</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                性別
              </label>
              <select
                value={personaSettings.gender}
                onChange={(e) => setPersonaSettings({...personaSettings, gender: e.target.value})}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">選択してください</option>
                <option value="男性">男性</option>
                <option value="女性">女性</option>
                <option value="その他">その他</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                職業
              </label>
              <input
                type="text"
                value={personaSettings.occupation}
                onChange={(e) => setPersonaSettings({...personaSettings, occupation: e.target.value})}
                placeholder="例: エンジニア、医師、教師など"
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                パーソナリティ
              </label>
              <textarea
                value={personaSettings.personality}
                onChange={(e) => setPersonaSettings({...personaSettings, personality: e.target.value})}
                placeholder="例: 明るく親しみやすい、論理的で分析的、優しく思いやりがあるなど"
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                追加情報
              </label>
              <textarea
                value={personaSettings.additionalInfo}
                onChange={(e) => setPersonaSettings({...personaSettings, additionalInfo: e.target.value})}
                placeholder="その他の特徴や詳細情報があれば入力してください"
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
            </div>
          </div>
        </ExpandableSection>

        {/* Scene Settings */}
        <ExpandableSection 
          title="シーン" 
          defaultExpanded={false}
          icon={MapPin}
        >
          <div className="pt-3 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                アポイントメントの背景
              </label>
              <textarea
                value={sceneSettings.appointmentBackground}
                onChange={(e) => setSceneSettings({...sceneSettings, appointmentBackground: e.target.value})}
                placeholder="例: 新商品の打ち合わせ、健康診断、面接など"
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                相手との関係性
              </label>
              <input
                type="text"
                value={sceneSettings.relationship}
                onChange={(e) => setSceneSettings({...sceneSettings, relationship: e.target.value})}
                placeholder="例: 同僚、友人、初対面、上司など"
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                時間帯
              </label>
              <select
                value={sceneSettings.timeOfDay}
                onChange={(e) => setSceneSettings({...sceneSettings, timeOfDay: e.target.value})}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">選択してください</option>
                <option value="朝">朝</option>
                <option value="午前">午前</option>
                <option value="昼">昼</option>
                <option value="午後">午後</option>
                <option value="夕方">夕方</option>
                <option value="夜">夜</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                場所
              </label>
              <input
                type="text"
                value={sceneSettings.location}
                onChange={(e) => setSceneSettings({...sceneSettings, location: e.target.value})}
                placeholder="例: オフィス、カフェ、病院、自宅など"
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                追加情報
              </label>
              <textarea
                value={sceneSettings.additionalInfo}
                onChange={(e) => setSceneSettings({...sceneSettings, additionalInfo: e.target.value})}
                placeholder="シーンに関する追加情報があれば入力してください"
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
            </div>
          </div>
        </ExpandableSection>


            {/* Generate Prompt Button */}
            <div className="pt-6">
              <Button
                onClick={handleGeneratePrompt}
                disabled={isStarting}
                className={`w-full py-4 text-base font-semibold ${
                  isStarting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
                icon={<Play size={20} />}
              >
                {isStarting ? 'プロンプト生成中...' : 'ロープレ開始'}
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
