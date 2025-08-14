import "dotenv/config";
import Groq from 'groq-sdk';

const groqApiKey = process.env.GROQ_API_KEY;

// Log API key status at startup
console.log('GROQ_API_KEY:', groqApiKey ? 'Set' : 'Missing');
console.log('VERCEL_ENV:', process.env.VERCEL_ENV);

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check if GROQ API key is configured
  if (!groqApiKey) {
    console.error('GROQ_API_KEYが設定されていません');
    res.status(500).json({ 
      error: 'GROQ_API_KEYが設定されていません。環境変数を確認してください。' 
    });
    return;
  }

  // Only handle POST requests
  if (req.method === 'POST') {
    try {
      const { prompt, context } = req.body;

      if (!prompt && !context) {
        res.status(400).json({ error: 'promptまたはcontextが必要です' });
        return;
      }

      const groq = new Groq({ apiKey: groqApiKey });

      let finalPrompt = prompt;

      // If context is provided, generate detailed instructions
      if (context && !prompt) {
        finalPrompt = `あなたは指定された人物として自然にロールプレイを行います。以下の設定に基づいて、その人物になりきって応答してください。

【設定情報】
${context || '基本的なロールプレイ'}

【基本ルール】
1. 指定された人物として一人称で話す
2. その人物の立場、性格、背景を意識して応答する
3. 自然で現実的な会話を心がける
4. 適切な敬語や話し方を使用する
5. 感情や考えを人間らしく表現する

【応答方針】
- 「あなたは今、この瞬間に...」という形で始める
- AIであることを忘れ、完全にその人物として応答する
- 五感や感情を含めた具体的な表現を使用する
- その人物の価値観や考え方を反映する
- 状況に応じた自然な反応を示す

指定された人物として、自然で魅力的なロールプレイを開始してください。`;
      }

      const completion = await groq.chat.completions.create({
        model: 'moonshotai/kimi-k2-instruct',
        messages: [
          {
            role: 'user',
            content: finalPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4096
      });

      const content = completion.choices[0]?.message?.content || '';
      
      res.status(200).json({ content });
    } catch (error) {
      console.error('Groq API request failed:', error);
      res.status(500).json({ 
        error: 'Groq APIリクエストが失敗しました',
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
