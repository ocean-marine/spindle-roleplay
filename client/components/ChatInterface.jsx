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
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <User size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">ロールプレイ停止中</h2>
        <p className="text-gray-600">セッションを開始してロールプレイを始めましょう</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 space-y-4 sm:space-y-8">
        
        {/* Persona Image */}
        <div className="w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <User size={48} className="sm:size-20 text-white" />
        </div>

        {/* Control Buttons below Persona Image */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mute button */}
          <button
            onClick={toggleMute}
            className={`p-2.5 sm:p-3 rounded-full transition-colors ${
              isMuted 
                ? 'bg-red-100 hover:bg-red-200 text-red-600' 
                : 'bg-green-100 hover:bg-green-200 text-green-600'
            }`}
            title={isMuted ? 'ミュート中 - クリックでミュート解除' : 'マイクオン - クリックでミュート'}
          >
            {isMuted ? <MicOff size={18} className="sm:size-5" /> : <Mic size={18} className="sm:size-5" />}
          </button>

          {/* End session button */}
          <button
            onClick={onStopSession}
            className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1.5 sm:gap-2 transition-colors text-sm sm:text-base"
            title="ロールプレイを終了して準備画面に戻る"
          >
            <X size={14} className="sm:size-4" />
            <span>終了</span>
          </button>
        </div>

        {/* Roleplay Meta Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-6 max-w-md w-full">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 text-center">ロールプレイ情報</h3>
          
          {/* Purpose */}
          {purpose && (
            <div className="mb-3 sm:mb-4">
              <h4 className="text-xs sm:text-sm font-medium text-gray-600 mb-1">目的</h4>
              <p className="text-sm sm:text-base text-gray-800">{purpose}</p>
            </div>
          )}

          {/* Persona Information */}
          <div className="mb-3 sm:mb-4">
            <h4 className="text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">ペルソナ</h4>
            <div className="space-y-0.5 sm:space-y-1 text-xs sm:text-sm text-gray-700">
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
            <h4 className="text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">シーン設定</h4>
            <div className="space-y-0.5 sm:space-y-1 text-xs sm:text-sm text-gray-700">
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

        {/* Status Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-sm border border-gray-200">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs sm:text-sm font-medium text-gray-700">ロールプレイ実行中</span>
        </div>

        {/* Mute status overlay */}
        {isMuted && (
          <div className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg z-20 flex items-center gap-1.5 sm:gap-2">
            <MicOff size={14} className="sm:size-4" />
            <span className="text-xs sm:text-sm font-medium">マイクミュート中</span>
          </div>
        )}
      </div>
    </div>
  );
}