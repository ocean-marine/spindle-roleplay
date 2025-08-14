import "dotenv/config";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { selectVoiceByRules } from '../client/utils/voiceSelection';
import type { VoiceOption } from '../client/types';

const apiKey = process.env.OPENAI_API_KEY;

// Enhanced startup logging
console.log('=== TOKEN API STARTUP ===');
console.log('Startup time:', new Date().toISOString());
console.log('Node version:', process.version);
console.log('Environment variables:');
console.log('- OPENAI_API_KEY:', apiKey ? `Set (length: ${apiKey.length}, prefix: ${apiKey.substring(0, 7)}...)` : 'Missing');
console.log('- GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Set' : 'Missing');
console.log('- VERCEL_ENV:', process.env.VERCEL_ENV || 'undefined');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'undefined');
console.log('- All env vars with OPENAI:', Object.keys(process.env).filter(key => key.includes('OPENAI')));
console.log('========================');

interface TokenRequest {
  presetVoice?: string;
  persona?: {
    age?: string;
    gender?: string;
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Detailed logging for debugging
  console.log('=== TOKEN API REQUEST ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Environment variables status:');
  console.log('- OPENAI_API_KEY:', apiKey ? `Set (length: ${apiKey.length})` : 'Missing');
  console.log('- GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Set' : 'Missing');
  console.log('- VERCEL_ENV:', process.env.VERCEL_ENV || 'undefined');
  console.log('- NODE_ENV:', process.env.NODE_ENV || 'undefined');

  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request handled');
    res.status(200).end();
    return;
  }

  // Check if OPENAI API key is configured
  if (!apiKey) {
    console.error('OPENAI_API_KEYが設定されていません');
    console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('OPENAI')));
    res.status(500).json({ 
      error: 'OPENAI_API_KEYが設定されていません。環境変数を確認してください。',
      timestamp: new Date().toISOString(),
      env: process.env.VERCEL_ENV || 'unknown'
    });
    return;
  }

  // Handle GET and POST requests to /token
  if (req.method === 'GET' || req.method === 'POST') {
    try {
      console.log('Processing token request...');
      
      // Default voice
      let selectedVoice = "verse";
      
      // If POST request with preset data, use preset voice; otherwise use persona-based selection
      if (req.method === 'POST' && req.body) {
        console.log('POST request body received:', req.body);
        const body = req.body as TokenRequest;
        const availableVoices: VoiceOption[] = [
          'alloy', 'ash', 'ballad', 'coral', 'echo', 'fable', 'nova', 
          'sage', 'shimmer', 'verse', 'juniper', 'breeze', 'maple', 
          'vale', 'ember', 'cove', 'sol', 'spruce', 'arbor'
        ];
        
        // Prioritize preset voice if provided
        if (body.presetVoice && availableVoices.includes(body.presetVoice as VoiceOption)) {
          selectedVoice = body.presetVoice;
          console.log('Using preset voice:', selectedVoice);
        } else if (body.persona) {
          // Fallback to persona-based selection
          selectedVoice = selectVoiceByRules(
            body.persona.age || '', 
            body.persona.gender || '', 
            availableVoices
          );
          console.log('Using persona-based voice:', selectedVoice);
        }
      }

      console.log('Selected voice:', selectedVoice);
      
      const requestBody = {
        model: "gpt-4o-realtime-preview-2025-06-03",
        voice: selectedVoice,
      };
      
      console.log('Making OpenAI API request with body:', requestBody);
      console.log('API Key prefix:', apiKey.substring(0, 7) + '...');

      const response = await fetch(
        "https://api.openai.com/v1/realtime/sessions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      console.log('OpenAI API response status:', response.status);
      console.log('OpenAI API response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('OpenAI API response data:', data);
      
      if (!response.ok) {
        console.error('OpenAI API error:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        res.status(response.status).json({
          error: 'OpenAI API error',
          details: data,
          status: response.status
        });
        return;
      }
      
      console.log('Token generation successful');
      res.status(200).json(data);
    } catch (error) {
      console.error("Token generation error details:", {
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      res.status(500).json({ 
        error: "Failed to generate token",
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
