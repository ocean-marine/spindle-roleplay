import { useState, useEffect } from "react";
import { X, Play } from "react-feather";
import Button from "./Button";

export default function PromptModal({ 
  isOpen, 
  onClose, 
  promptText, 
  onStartSession,
  hasSettingsChanges = true
}) {
  const [editedPrompt, setEditedPrompt] = useState("");

  // Update edited prompt when promptText changes
  useEffect(() => {
    setEditedPrompt(promptText);
  }, [promptText]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
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
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            {hasSettingsChanges 
              ? 'プロンプトを確認・編集して会話を始めます' 
              : 'カスタム指示を入力して会話を始めます'
            }
          </p>
          
          <div className="mb-6">
            <textarea
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
              className="w-full h-60 p-4 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
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