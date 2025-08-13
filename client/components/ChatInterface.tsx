import { User, Mic, MicOff, X } from "react-feather";
import type { ChatInterfaceProps } from "../types";

export default function ChatInterface({ 
  isSessionActive,
  isMuted = false,
  toggleMute,
  personaSettings = {},
  sceneSettings = {},
  purpose = "",
  onStopSession
}: ChatInterfaceProps): JSX.Element {

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
    <div className="flex-1 flex flex-col h-full bg-white overflow-x-hidden overflow-y-auto">
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-12">
        
        {/* Persona Image - Large and centered */}
        <div className="relative w-64 h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
          {personaSettings.image ? (
            <img 
              src={`/personas/${personaSettings.image}`} 
              alt="Persona" 
              className="w-full h-full rounded-full object-cover"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                const nextSibling = target.nextSibling as HTMLElement;
                target.style.display = 'none';
                if (nextSibling) {
                  nextSibling.style.display = 'flex';
                }
              }}
            />
          ) : null}
          <User 
            size={100} 
            className={`text-gray-400 ${personaSettings.image ? 'hidden' : 'flex'}`} 
          />
        </div>

        {/* Control Buttons - Clean and minimal */}
        <div className="flex items-center gap-6">
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
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          {/* End session button */}
          <button
            onClick={onStopSession}
            className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
            title="ロールプレイを終了して準備画面に戻る"
          >
            <X size={18} />
            <span>戻る</span>
          </button>
        </div>

        {/* Status Indicator - Minimal */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">接続中</span>
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