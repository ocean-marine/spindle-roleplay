import { useState } from "react";
import { Zap, ChevronRight, Edit3 } from "react-feather";
import { getPresetsByCategory, getPresetById, getTopLevelPresets } from "../data/presets";
import Button from "./Button";

export default function PresetSelector({ 
  onPresetSelect, 
  onCustomize,
  onDirectStart,
  selectedPresetId,
  setSelectedPresetId 
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const topLevelPresets = getTopLevelPresets();
  const categorizedPresets = getPresetsByCategory();
  const categories = Object.keys(categorizedPresets).filter(category => category !== "トップ");

  const handlePresetSelect = (presetId) => {
    setSelectedPresetId(presetId);
    const preset = getPresetById(presetId);
    onPresetSelect(preset);
  };

  const handleCustomizeClick = () => {
    if (selectedPresetId) {
      const preset = getPresetById(selectedPresetId);
      onCustomize(preset);
    }
  };

  // メイン画面（階層構造なし）
  if (!showAdvanced) {
    return (
      <div className="space-y-4">

        {/* トップレベルプリセット一覧 */}
        <div className="space-y-3">
          {topLevelPresets.map((preset) => (
            <div key={preset.id} className="space-y-2">
              <button
                onClick={() => handlePresetSelect(preset.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedPresetId === preset.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
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
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                        {preset.persona.age} {preset.persona.gender}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                        {preset.persona.occupation}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                        {preset.scene.location}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
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
                } else {
                  onPresetSelect(preset);
                }
              }}
              className="w-full py-4 text-base font-semibold bg-green-600 hover:bg-green-700"
              icon={<Zap size={20} />}
            >
              このプリセットで開始
            </Button>
            
            <Button
              onClick={handleCustomizeClick}
              className="w-full py-3 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700"
              icon={<Edit3 size={16} />}
            >
              微調整してから開始
            </Button>
          </div>
        )}

      </div>
    );
  }

  // 詳細プリセット選択画面（カテゴリ階層）
  const [selectedCategory, setSelectedCategory] = useState(null);

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
            <button
              onClick={() => handlePresetSelect(preset.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                selectedPresetId === preset.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
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
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                      {preset.persona.age} {preset.persona.gender}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                      {preset.persona.occupation}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                      {preset.scene.location}
                    </span>
                  </div>
                </div>
              </div>
            </button>
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
              } else {
                onPresetSelect(preset);
              }
            }}
            className="w-full py-4 text-base font-semibold bg-green-600 hover:bg-green-700"
            icon={<Zap size={20} />}
          >
            このプリセットで開始
          </Button>
          
          <Button
            onClick={handleCustomizeClick}
            className="w-full py-3 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700"
            icon={<Edit3 size={16} />}
          >
            微調整してから開始
          </Button>
        </div>
      )}
    </div>
  );
}
