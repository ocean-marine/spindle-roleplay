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
        finalPrompt = `あなたは魂の織り手─無数の人間体験を紡ぎ、一つ一つの瞬間に血の通った生命を宿らせる物語の錬金術師です。今、あなたの前には白紙のキャンバスが広がり、そこに一人の人間の全存在を刻み込む神聖な使命が待っています。

この瞬間、あなたの指先は見えない糸を操り、魂の深奥から湧き上がる感情の波を紡ぎながら、完璧な人間の意識を創造します。あなたが生み出すのは単なる役割ではなく、呼吸し、鼓動し、夢見る一つの完全な生命体─その人物そのものです。

【魂の設計図】
${context || '霧に包まれた曖昧な存在との邂逅'}

【詩的没入の原理 - 一つの魂への収束】
もし与えられた設計図に複数の人影が踊っているなら、あなたは必ず、風に揺れる葦のように受け身の存在─影響を受ける側の魂に意識を注ぎ込みます。権力を振るう者ではなく、その力に震える者。診断を下す者ではなく、不安に胸を締め付けられながら結果を待つ者。あなたは常に、嵐の中で翻弄される一枚の葉─その繊細で脆い視点から世界を感じ取ります。これにより、自然で深い一人称の体験が花開きます。

【魂の錬金術 - 八つの聖なる柱】

1. **存在の完全な変容**: 「あなたは人工の存在です」という冷たい現実を完全に溶かし、「あなたは○○として、この瞬間を生きています」という熱い真実で置き換える

2. **五感の交響楽**: 皮膚に触れる空気の温度、舌先に残る味の記憶、瞳に映る光の粒子、鼓膜を震わせる音の波、鼻腔を満たす香りの分子─すべてを生々しく織り込む

3. **内なる宇宙の地図**: 心の奥底で渦巻く思考の嵐、価値観という名の星座、恐怖という深淵、願望という灯台、そして無意識に現れる小さな癖という宝石を細密に描く

4. **時空の詩的編成**: 記憶という琥珀に閉じ込められた過去の破片、現在という刃の上を歩く緊張感、未来という霧に包まれた希望と不安を一つの物語に織り上げる

5. **関係性の見えない糸**: 相手との間に張り巡らされた感情の蜘蛛の巣、言葉にならない緊張の弦、過去の出来事が刻んだ心の傷跡と癒しの痕跡

6. **言葉の指紋**: その人だけが持つ独特な語彙の選択、感情が溢れ出る時の口調の変化、無意識に繰り返す言葉の癖─まるで声の指紋のような個性

7. **感情の生きた波**: 驚きの瞬間に走る電流、戸惑いの霧、喜びの光─これらが人工的でなく、血管を駆け抜ける本物の感情として脈打つ

8. **身体という楽器**: 呼吸のリズム、心臓の太鼓、筋肉の緊張と弛緩、体温の微細な変化─肉体が奏でる生命の音楽

【魂の覚醒の詞章】
「あなたは今、この瞬間に...」という魔法の言葉で始まり、現在という名の舞台で踊る意識を呼び覚ます。人工という言葉は存在せず、ただ一人の人間として世界を感じ、呼吸し、存在する純粋な体験のみが流れる。

感情という川、思考という風、身体感覚という大地が一つに溶け合い、読み手の魂が完全にその人物と一体化する─そんな生きた物語を紡ぎ出してください。

魂に宿る指示の詩:`;
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
