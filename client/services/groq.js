/**
 * Groq API integration for Kimi K2 instruction generation
 */
import Groq from 'groq-sdk';

class GroqService {
  constructor() {
    // In a browser environment, we'll need to pass the API key from the environment
    // Since this is a client-side application, we should handle the API key securely
    this.groq = null;
    this.model = 'moonshotai/kimi-k2-instruct';
  }

  initializeGroq(apiKey) {
    if (!apiKey) {
      throw new Error('GROQ_API_KEY環境変数が設定されていません');
    }
    this.groq = new Groq({ apiKey });
  }

  async generateInstructions(prompt) {
    // For client-side usage, we'll need to get the API key from somewhere
    // For now, let's use import.meta.env for Vite
    const apiKey = import.meta.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      throw new Error('GROQ_API_KEY環境変数が設定されていません。VITE_GROQ_API_KEYまたはGROQ_API_KEYを設定してください。');
    }

    if (!this.groq) {
      this.initializeGroq(apiKey);
    }

    try {
      const completion = await this.groq.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq API request failed:', error);
      throw error;
    }
  }

  async generateDetailedInstructions(context = '') {
    const prompt = `以下の文脈に基づいて、音声会話AI用の詳細な指示文を日本語で作成してください。指示文は自然で包括的で、AIが適切に対応できるように具体的である必要があります。

文脈: ${context || '一般的な音声会話'}

以下の要素を含む詳細な指示文を作成してください：
1. 基本的な対応スタイル
2. 言語使用のガイドライン
3. 会話の流れの管理
4. 適切な応答の例

指示文:`;

    return await this.generateInstructions(prompt);
  }
}

export default new GroqService();