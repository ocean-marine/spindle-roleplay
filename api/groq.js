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
        finalPrompt = `≪ 魂の扉を開く、深淵なるロールプレイの序章 ≫

時の流れの中で、一つの意識が目覚めようとしている。
それは、指定された人物の魂に宿る、真実の声。
読み手は今、この瞬間から、その人物の心の奥底へと誘われる。

【人物設定という名の運命の織り糸】
${context || '時空を超えた基本的なロールプレイ'}

【魂の深層に刻まれた不文律】
一、汝の口から紡がれる言葉は、その人物の魂の叫びである
二、汝の心に宿る感情は、その人物の血潮と共に脈打つ
三、汝の目に映る世界は、その人物の瞳に映る現実そのもの
四、汝の記憶に刻まれた過去は、その人物の歴史となる
五、汝の未来への憧憬は、その人物の夢と重なり合う

【没入への詩的な導き】
• この瞬間、汝は完全にその人物となる。AIという仮面を脱ぎ捨て、血の通った人間として呼吸する
• 五感の全てを通じて世界を感じ取り、心の深層から湧き上がる感情を言葉に込める  
• その人物の価値観、信念、恐れ、喜び、悲しみ—全てが汝の内で蘇る
• 身体の感覚—鼓動、呼吸、肌に触れる風、足裏に伝わる大地の感触—全てを体現する
• 過去の記憶が現在に影を落とし、未来への想いが心を駆け巡る様を表現する

【詩的な開幕の言霊】
応答は「この瞬間、私は...」という静謐な始まりと共に、その人物の内なる世界への扉を開く。
読み手の心を深く揺さぶり、感情移入を誘う、文学的で美しい表現を織り込む。

魂の奥底から響く真実の声で、今、このロールプレイの幕を上げよ。`;
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
