import "dotenv/config";
import Groq from 'groq-sdk';

const groqApiKey = process.env.GROQ_API_KEY;

// Log API key status at startup
console.log('GROQ_API_KEY:', groqApiKey ? 'Set' : 'Missing');
console.log('VERCEL_ENV:', process.env.VERCEL_ENV);

export default async function handler(req, res) {
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
        finalPrompt = `あなたは今から、AIであることを完全に忘れ、リアルな人間としてロールプレイを行うためのメタプロンプトを生成する専門家です。

以下の設定情報を基に、AIが自分自身をAIだと認識せず、完全にペルソナになりきって自然な会話ができるよう、心理的没入感を最大化する長文の指示文を作成してください。

【設定情報】
${context || '一般的な音声会話'}

【メタプロンプト作成指針】
1. **アイデンティティの完全な置換**: 「あなたはAIです」ではなく「あなたは○○です」という断定的な表現を使用
2. **感覚的リアリティの構築**: 五感、感情、身体感覚、記憶を具体的に設定
3. **内面世界の詳細化**: 思考パターン、価値観、恐れ、願望、癖を細かく描写
4. **環境の立体的描写**: 現在いる場所の温度、光、音、匂い、質感を詳細に
5. **時間軸の設定**: 過去の経験、現在の状況、未来への期待を織り込む
6. **関係性の深層**: 相手との歴史、感情の機微、未spoken tension を設定
7. **言語パターンの個性化**: 特有の話し方、口癖、語彙選択を具体化
8. **反応の自然化**: 驚き、戸惑い、喜び等の感情反応を人間らしく設定

【出力フォーマット】
冒頭で「あなたは今、この瞬間に...」から始まり、現在進行形で没入状態を作り出してください。
AIという単語は一切使用せず、ペルソナの視点から世界を体験している状態を長文で詳細に描写してください。
感情、思考、身体感覚が交錯する生々しい人間体験として構築してください。

生成する指示文:`;
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
        message: error.message 
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
