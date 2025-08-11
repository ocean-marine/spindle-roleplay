import OpenAI from "openai";
import { VercelRequest, VercelResponse } from '@vercel/node';

interface TTSRequestBody {
  voice?: string;
  text?: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { voice = 'alloy', text = 'こんにちは。音声テストです。' }: TTSRequestBody = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Create TTS audio using OpenAI API
    const mp3 = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voice as 'alloy' | 'echo' | 'fable' | 'nova' | 'onyx' | 'shimmer',
      input: text,
      instructions: "Speak in a clear and natural tone.",
    });

    // Convert to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Set appropriate headers for audio response
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.status(200).send(buffer);

  } catch (error) {
    console.error('TTS Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate speech',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}