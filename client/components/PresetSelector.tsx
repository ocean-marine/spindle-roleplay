import { useState } from "react";
import { Zap, ChevronRight, Edit3, MoreHorizontal, X, Volume2 } from "react-feather";
import { getPresetsByCategory, getPresetById, getTopLevelPresets, getPresetsByTab } from "../data/presets";
import Button from "./Button";
import type { PresetSelectorProps, PresetData, VoiceOption } from "../types";

export default function PresetSelector({ 
  onPresetSelect, 
  onDirectStart,
  selectedPresetId,
  setSelectedPresetId,
  activeTab
}: PresetSelectorProps & { activeTab?: string }) {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [selectedPresetForSettings, setSelectedPresetForSettings] = useState<PresetData | null>(null);
  
  // Get presets based on active tab or fall back to top level presets
  const currentPresets = activeTab ? getPresetsByTab(activeTab) : getTopLevelPresets();
  const categorizedPresets = getPresetsByCategory();
  const categories = Object.keys(categorizedPresets).filter(category => category !== "トップ");

  const handlePresetSelect = (presetId: string): void => {
    const preset = getPresetById(presetId);
    if (preset && preset.predefinedInstructions && onDirectStart) {
      onDirectStart(preset);
    } else if (preset) {
      setSelectedPresetId(presetId);
      onPresetSelect(preset);
    }
  };

  const handleCustomizeClick = (preset: PresetData): void => {
    if (preset) {
      setSelectedPresetForSettings(preset);
      setShowSettingsModal(true);
    }
  };

  const handleTestVoice = (voice: VoiceOption): void => {
    // 音声テスト機能（実際の実装では音声再生APIを呼び出し）
    console.log(`Testing voice: ${voice}`);
    alert(`声色「${voice}」のテストを実行します。実際の実装では音声が再生されます。`);
  };

  const handleCloseSettingsModal = () => {
    setShowSettingsModal(false);
    setSelectedPresetForSettings(null);
  };

  const handleStartWithPreset = (preset: PresetData) => {
    setShowSettingsModal(false);
    setSelectedPresetForSettings(null);
    if (preset && preset.predefinedInstructions && onDirectStart) {
      onDirectStart(preset);
    } else {
      setSelectedPresetId(preset.id);
      onPresetSelect(preset);
    }
  };

  // 設定確認モーダルコンポーネント
  const settingsModal = showSettingsModal && selectedPresetForSettings && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* モーダルヘッダー */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">プリセット設定確認</h2>
          <button
            onClick={handleCloseSettingsModal}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* プリセット基本情報 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <span className="text-3xl">{selectedPresetForSettings.icon}</span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {selectedPresetForSettings.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {selectedPresetForSettings.description}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 bg-black bg-opacity-60 text-white rounded-full">
                  {selectedPresetForSettings.persona.age} {selectedPresetForSettings.persona.gender}
                </span>
                <span className="px-3 py-1 bg-black bg-opacity-60 text-white rounded-full">
                  {selectedPresetForSettings.persona.occupation}
                </span>
                <span className="px-3 py-1 bg-black bg-opacity-60 text-white rounded-full">
                  {selectedPresetForSettings.scene.location}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 声色設定 */}
        <div className="p-6 border-b border-gray-100">
          <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Volume2 size={18} />
            声色設定
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">
                  選択された声色: <span className="text-blue-600">{selectedPresetForSettings.voice}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  この声色でAIが応答します
                </p>
              </div>
              <button
                onClick={() => handleTestVoice(selectedPresetForSettings.voice as VoiceOption)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Volume2 size={16} />
                声色確認
              </button>
            </div>
          </div>
        </div>

        {/* 指示文確認 */}
        <div className="p-6 border-b border-gray-100">
          <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Edit3 size={18} />
            指示文確認
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
              {selectedPresetForSettings.predefinedInstructions}
            </pre>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="p-6 flex gap-3 justify-end">
          <button
            onClick={handleCloseSettingsModal}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            閉じる
          </button>
          <button
            onClick={() => handleStartWithPreset(selectedPresetForSettings)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Zap size={16} />
            このプリセットで開始
          </button>
        </div>
      </div>
    </div>
  );

  // メイン画面（階層構造なし）
  if (!showAdvanced) {
    return (
      <>
        <div className="space-y-4">

          {/* 現在のタブのプリセット一覧 */}
          <div className="space-y-3">
            {currentPresets.map((preset) => (
              <div key={preset.id} className="space-y-2">
                <div className={`relative w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedPresetId === preset.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                }`}>
                  {/* Settings button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCustomizeClick(preset);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
                    title="声色・プロンプト設定"
                  >
                    <MoreHorizontal size={16} className="text-gray-500 hover:text-gray-700" />
                  </button>
                  
                  {/* Main preset button */}
                  <button
                    onClick={() => handlePresetSelect(preset.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start gap-3 pr-8">
                      <span className="text-2xl">{preset.icon}</span>
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-1 ${
                          selectedPresetId === preset.id ? 'text-blue-800' : 'text-gray-800'
                        }`}>
                          {preset.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {preset.description}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="px-2 py-1 bg-black bg-opacity-80 text-white rounded-full">
                            {preset.persona.age} {preset.persona.gender}
                          </span>
                          <span className="px-2 py-1 bg-black bg-opacity-80 text-white rounded-full">
                            {preset.persona.occupation}
                          </span>
                          <span className="px-2 py-1 bg-black bg-opacity-80 text-white rounded-full">
                            {preset.scene.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* アクションボタン */}
          {selectedPresetId && (
            <div className="pt-4 space-y-3 border-t border-gray-200">
              <Button
                onClick={() => {
                  const preset = getPresetById(selectedPresetId);
                  if (preset && preset.predefinedInstructions && onDirectStart) {
                    onDirectStart(preset);
                  } else if (preset) {
                    onPresetSelect(preset);
                  }
                }}
                className="w-full py-4 text-base font-semibold bg-green-600 hover:bg-green-700"
                icon={<Zap size={20} />}
              >
                このプリセットで開始
              </Button>
              
            </div>
          )}
        </div>
        {settingsModal}
      </>
    );
  }

  // 詳細プリセット選択画面（カテゴリ階層）
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!selectedCategory) {
    // カテゴリ選択画面
    return (
      <div className="space-y-4">
        {/* ヘッダー */}
        <div className="flex items-center gap-3 py-2">
          <button
            onClick={() => setShowAdvanced(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600 transform rotate-180" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-800">その他のプリセット</h2>
            <p className="text-sm text-gray-600">カテゴリを選択してください</p>
          </div>
        </div>

        {/* カテゴリ一覧 */}
        <div className="space-y-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="w-full p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
                    {category}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {categorizedPresets[category].length}個のプリセット
                  </p>
                </div>
                <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // カテゴリ内プリセット選択画面
  const categoryPresets = categorizedPresets[selectedCategory];
  
  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 py-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight size={20} className="text-gray-600 transform rotate-180" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-gray-800">{selectedCategory}</h2>
          <p className="text-sm text-gray-600">プリセットを選択してください</p>
        </div>
      </div>

      {/* プリセット一覧 */}
      <div className="space-y-3">
        {categoryPresets.map((preset) => (
          <div key={preset.id} className="space-y-2">
            <div className={`relative w-full p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedPresetId === preset.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
            }`}>
              {/* Settings button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCustomizeClick(preset);
                }}
                className="absolute top-3 right-3 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
                title="声色・プロンプト設定"
              >
                <MoreHorizontal size={16} className="text-gray-500 hover:text-gray-700" />
              </button>
              
              {/* Main preset button */}
              <button
                onClick={() => handlePresetSelect(preset.id)}
                className="w-full text-left"
              >
                <div className="flex items-start gap-3 pr-8">
                  <span className="text-2xl">{preset.icon}</span>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${
                      selectedPresetId === preset.id ? 'text-blue-800' : 'text-gray-800'
                    }`}>
                      {preset.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {preset.description}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-black bg-opacity-80 text-white rounded-full">
                        {preset.persona.age} {preset.persona.gender}
                      </span>
                      <span className="px-2 py-1 bg-black bg-opacity-80 text-white rounded-full">
                        {preset.persona.occupation}
                      </span>
                      <span className="px-2 py-1 bg-black bg-opacity-80 text-white rounded-full">
                        {preset.scene.location}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>
      {settingsModal}
    </div>
  );
}
