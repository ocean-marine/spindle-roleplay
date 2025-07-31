import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "react-feather";

export default function VoiceInterface({ 
  isSessionActive, 
  isListening = false, 
  isSpeaking = false,
  audioLevel = 0 
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [showVisualizer, setShowVisualizer] = useState(false);

  // Generate wave visualization
  useEffect(() => {
    if (!isSessionActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerY = canvas.height / 2;
    let time = 0;

    function drawWave() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, isSpeaking ? '#3B82F6' : '#10B981');
      gradient.addColorStop(1, isSpeaking ? '#1D4ED8' : '#059669');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      
      // Draw multiple wave layers
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        ctx.globalAlpha = 0.7 - (layer * 0.2);
        
        for (let x = 0; x < canvas.width; x += 2) {
          const frequency = 0.01 + (layer * 0.005);
          const amplitude = (isListening || isSpeaking) 
            ? 20 + (audioLevel * 50) + (layer * 10)
            : 5 + (layer * 2);
          
          const y = centerY + Math.sin(x * frequency + time + (layer * Math.PI / 3)) * amplitude;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }
      
      time += 0.1;
      animationRef.current = requestAnimationFrame(drawWave);
    }

    if (isSessionActive) {
      setShowVisualizer(true);
      drawWave();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSessionActive, isListening, isSpeaking, audioLevel]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      const ctx = canvas.getContext('2d');
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  if (!isSessionActive) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <MicOff size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">セッション停止中</h2>
        <p className="text-gray-600">音声インタラクションを開始するにはセッションを開始してください</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
      {/* Status indicators */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-sm">
          {isListening ? (
            <>
              <Mic size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-600">リスニング中</span>
            </>
          ) : (
            <>
              <MicOff size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-500">スタンバイ</span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-sm">
          {isSpeaking ? (
            <>
              <Volume2 size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-600">音声出力中</span>
            </>
          ) : (
            <>
              <VolumeX size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-500">無音</span>
            </>
          )}
        </div>
      </div>

      {/* Main microphone visualization */}
      <div className="relative">
        <div className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 ${
          isListening 
            ? 'bg-green-100 shadow-lg shadow-green-500/20' 
            : isSpeaking 
            ? 'bg-blue-100 shadow-lg shadow-blue-500/20' 
            : 'bg-gray-100'
        }`}>
          <Mic size={64} className={`transition-colors ${
            isListening 
              ? 'text-green-600' 
              : isSpeaking 
              ? 'text-blue-600' 
              : 'text-gray-400'
          }`} />
        </div>
        
        {/* Pulse animation rings */}
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-20"></div>
            <div className="absolute inset-4 rounded-full border-2 border-green-400 animate-ping opacity-30 animation-delay-150"></div>
          </>
        )}
      </div>

      {/* Wave visualization */}
      {showVisualizer && (
        <div className="w-full max-w-md h-32 mt-8 relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full rounded-lg bg-gray-50"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}

      {/* Instruction text */}
      <div className="mt-8 text-center">
        <p className="text-lg font-medium text-gray-800 mb-2">
          {isListening ? "聞いています..." : isSpeaking ? "AIが応答中..." : "タップして話してください"}
        </p>
        <p className="text-sm text-gray-600">
          音声会話がアクティブです。自然に話しかけてください。
        </p>
      </div>
    </div>
  );
}