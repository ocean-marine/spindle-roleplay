import { useState } from "react";
import { 
  Settings, 
  Volume2, 
  Mic, 
  Bell, 
  Smartphone, 
  Info, 
  HelpCircle,
  Download,
  RefreshCw,
  Shield
} from "react-feather";

function SettingSection({ title, children, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {Icon && <Icon size={20} className="text-gray-600" />}
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
      </div>
      <div className="p-4 space-y-4">
        {children}
      </div>
    </div>
  );
}

function SettingItem({ label, description, children, disabled = false }) {
  return (
    <div className={`flex items-center justify-between ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex-1 min-w-0 mr-4">
        <label className="block text-sm font-medium text-gray-800">
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  );
}

function ToggleSwitch({ enabled, onChange, disabled = false }) {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled 
          ? 'bg-blue-600' 
          : 'bg-gray-200'
      } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function SettingsScreen({ 
  selectedVoice, 
  setSelectedVoice, 
  VOICE_OPTIONS 
}) {
  // Local settings state
  const [settings, setSettings] = useState({
    audioEnabled: true,
    microphoneEnabled: true,
    notificationsEnabled: true,
    vibrationEnabled: true,
    autoScroll: true,
    darkMode: false,
    reducedMotion: false,
    highContrast: false
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleExportData = () => {
    const dataToExport = {
      settings,
      selectedVoice,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `realtime-console-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleResetSettings = () => {
    if (window.confirm('すべての設定をデフォルトにリセットしてよろしいですか？この操作は元に戻せません。')) {
      setSettings({
        audioEnabled: true,
        microphoneEnabled: true,
        notificationsEnabled: true,
        vibrationEnabled: true,
        autoScroll: true,
        darkMode: false,
        reducedMotion: false,
        highContrast: false
      });
      setSelectedVoice('alloy');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="p-4 max-w-md mx-auto">
        {/* Header */}
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">設定</h1>
          <p className="text-gray-600">あなたの体験をカスタマイズ</p>
        </div>

        {/* Audio Settings */}
        <SettingSection title="オーディオと音声" icon={Volume2}>
          <SettingItem 
            label="Voice Model"
            description="会話用のAI音声を選択"
          >
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {VOICE_OPTIONS.map((voice) => (
                <option key={voice} value={voice}>
                  {voice}
                </option>
              ))}
            </select>
          </SettingItem>

          <SettingItem 
            label="オーディオ出力"
            description="AI応答からの音声を有効化"
          >
            <ToggleSwitch
              enabled={settings.audioEnabled}
              onChange={(value) => updateSetting('audioEnabled', value)}
            />
          </SettingItem>

          <SettingItem 
            label="マイクアクセス"
            description="セッション中の音声入力を許可"
          >
            <ToggleSwitch
              enabled={settings.microphoneEnabled}
              onChange={(value) => updateSetting('microphoneEnabled', value)}
            />
          </SettingItem>
        </SettingSection>

        {/* Interface Settings */}
        <SettingSection title="インターフェース" icon={Smartphone}>
          <SettingItem 
            label="メッセージ自動スクロール"
            description="新しいメッセージに自動でスクロール"
          >
            <ToggleSwitch
              enabled={settings.autoScroll}
              onChange={(value) => updateSetting('autoScroll', value)}
            />
          </SettingItem>

          <SettingItem 
            label="ダークモード"
            description="ダークカラースキームを使用"
            disabled={true}
          >
            <ToggleSwitch
              enabled={settings.darkMode}
              onChange={(value) => updateSetting('darkMode', value)}
              disabled={true}
            />
          </SettingItem>

          <SettingItem 
            label="モーション減少"
            description="アニメーションとトランジションを最小化"
          >
            <ToggleSwitch
              enabled={settings.reducedMotion}
              onChange={(value) => updateSetting('reducedMotion', value)}
            />
          </SettingItem>

          <SettingItem 
            label="高コントラスト"
            description="視認性向上のため色のコントラストを強化"
          >
            <ToggleSwitch
              enabled={settings.highContrast}
              onChange={(value) => updateSetting('highContrast', value)}
            />
          </SettingItem>
        </SettingSection>

        {/* Notifications */}
        <SettingSection title="通知" icon={Bell}>
          <SettingItem 
            label="プッシュ通知"
            description="重要なイベントの通知を受信"
          >
            <ToggleSwitch
              enabled={settings.notificationsEnabled}
              onChange={(value) => updateSetting('notificationsEnabled', value)}
            />
          </SettingItem>

          <SettingItem 
            label="バイブレーション"
            description="アラート時にモバイルデバイスを振動"
          >
            <ToggleSwitch
              enabled={settings.vibrationEnabled}
              onChange={(value) => updateSetting('vibrationEnabled', value)}
            />
          </SettingItem>
        </SettingSection>

        {/* Data & Privacy */}
        <SettingSection title="データとプライバシー" icon={Shield}>
          <SettingItem 
            label="設定のエクスポート"
            description="設定をJSONファイルとしてダウンロード"
          >
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download size={14} />
エクスポート
            </button>
          </SettingItem>

          <SettingItem 
            label="設定をリセット"
            description="すべての設定をデフォルトに復元"
          >
            <button
              onClick={handleResetSettings}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
            >
              <RefreshCw size={14} />
リセット
            </button>
          </SettingItem>
        </SettingSection>

        {/* App Information */}
        <SettingSection title="アケウト" icon={Info}>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">バージョン</span>
              <span className="font-medium">2.0.0 Mobile</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ビルド</span>
              <span className="font-medium">Mobile-First Redesign</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">API</span>
              <span className="font-medium">OpenAI Realtime</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <HelpCircle size={16} />
              <span className="text-sm">ヘルプとサポート</span>
            </button>
          </div>
        </SettingSection>

        {/* Bottom padding for tab navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}