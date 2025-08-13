import "dotenv/config";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { selectVoiceByRules } from '../client/utils/voiceSelection';
import type { VoiceOption } from '../client/types';

const apiKey = process.env.OPENAI_API_KEY;

// Log API key status at startup
console.log('OPENAI_API_KEY:', apiKey ? 'Set' : 'Missing');
console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Set' : 'Missing');
console.log('VERCEL_ENV:', process.env.VERCEL_ENV);

interface TokenRequest {
  presetVoice?: string;
  persona?: {
    age?: string;
    gender?: string;
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check if OPENAI API key is configured
  if (!apiKey) {
    console.error('OPENAI_API_KEYが設定されていません');
    res.status(500).json({ 
      error: 'OPENAI_API_KEYが設定されていません。環境変数を確認してください。' 
    });
    return;
  }

  // Handle GET and POST requests to /token
  if (req.method === 'GET' || req.method === 'POST') {
    try {
      // Default voice
      let selectedVoice = "verse";
      
      // If POST request with preset data, use preset voice; otherwise use persona-based selection
      if (req.method === 'POST' && req.body) {
        const body = req.body as TokenRequest;
        const availableVoices: VoiceOption[] = [
          'alloy', 'ash', 'ballad', 'coral', 'echo', 'fable', 'nova', 
          'sage', 'shimmer', 'verse', 'juniper', 'breeze', 'maple', 
          'vale', 'ember', 'cove', 'sol', 'spruce', 'arbor'
        ];
        
        // Prioritize preset voice if provided
        if (body.presetVoice && availableVoices.includes(body.presetVoice as VoiceOption)) {
          selectedVoice = body.presetVoice;
        } else if (body.persona) {
          // Fallback to persona-based selection
          selectedVoice = selectVoiceByRules(
            body.persona.age || '', 
            body.persona.gender || '', 
            availableVoices
          );
        }
      }

      const response = await fetch(
        "https://api.openai.com/v1/realtime/sessions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-realtime-preview-2025-06-03",
            voice: selectedVoice,
          }),
        },
      );

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Token generation error:", error);
      res.status(500).json({ error: "Failed to generate token" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
