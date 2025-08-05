import { User, Mic, MicOff, X } from "react-feather";

export default function ChatInterface({ 
  isSessionActive,
  isMuted = false,
  toggleMute,
  personaSettings = {},
  sceneSettings = {},
  purpose = "",
  onStopSession
}) {

  if (!isSessionActive) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
        <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <User size={48} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">ロールプレイ停止中</h2>
        <p className="text-gray-500">セッションを開始してロールプレイを始めましょう</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        
        {/* Persona Image - Clean and minimal */}
        <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center">
          <User size={48} className="text-gray-400" />
        </div>

        {/* Roleplay Meta Information */}
        <div className="bg-gray-50 rounded-lg border border-gray-100 p-6 max-w-lg w-full">
          <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">ロールプレイ情報</h3>
          
          {/* Purpose */}
          {purpose && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-1">目的</h4>
              <p className="text-base text-gray-900">{purpose}</p>
            </div>
          )}

          {/* Persona Information */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">ペルソナ</h4>
            <div className="space-y-1 text-sm text-gray-700">
              {personaSettings.age && <p><span className="font-medium">年齢:</span> {personaSettings.age}</p>}
              {personaSettings.gender && <p><span className="font-medium">性別:</span> {personaSettings.gender}</p>}
              {personaSettings.occupation && <p><span className="font-medium">職業:</span> {personaSettings.occupation}</p>}
              {personaSettings.personality && <p><span className="font-medium">性格:</span> {personaSettings.personality}</p>}
              {personaSettings.additionalInfo && <p><span className="font-medium">追加情報:</span> {personaSettings.additionalInfo}</p>}
              {!personaSettings.age && !personaSettings.gender && !personaSettings.occupation && !personaSettings.personality && !personaSettings.additionalInfo && (
                <p className="text-gray-500 italic">設定なし</p>
              )}
            </div>
          </div>

          {/* Scene Information */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">シーン設定</h4>
            <div className="space-y-1 text-sm text-gray-700">
              {sceneSettings.appointmentBackground && <p><span className="font-medium">背景:</span> {sceneSettings.appointmentBackground}</p>}
              {sceneSettings.relationship && <p><span className="font-medium">関係性:</span> {sceneSettings.relationship}</p>}
              {sceneSettings.timeOfDay && <p><span className="font-medium">時間帯:</span> {sceneSettings.timeOfDay}</p>}
              {sceneSettings.location && <p><span className="font-medium">場所:</span> {sceneSettings.location}</p>}
              {sceneSettings.additionalInfo && <p><span className="font-medium">追加情報:</span> {sceneSettings.additionalInfo}</p>}
              {!sceneSettings.appointmentBackground && !sceneSettings.relationship && !sceneSettings.timeOfDay && !sceneSettings.location && !sceneSettings.additionalInfo && (
                <p className="text-gray-500 italic">設定なし</p>
              )}
            </div>
          </div>
        </div>

        {/* Control Buttons - Clean and minimal */}
        <div className="flex items-center gap-4">
          {/* Mute button */}
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full transition-colors ${
              isMuted 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title={isMuted ? 'ミュート中 - クリックでミュート解除' : 'マイクオン - クリックでミュート'}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* End session button */}
          <button
            onClick={onStopSession}
            className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
            title="ロールプレイを終了して準備画面に戻る"
          >
            <X size={16} />
            <span>終了</span>
          </button>
        </div>

        {/* Status Indicator - Minimal */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">ロールプレイ実行中</span>
        </div>

        {/* Mute status overlay - Clean */}
        {isMuted && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg z-20 flex items-center gap-2">
            <MicOff size={16} />
            <span className="text-sm font-medium">マイクミュート中</span>
          </div>
        )}
      </div>
    </div>
  );
}