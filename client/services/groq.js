/**
 * Groq API integration for Kimi K2 instruction generation
 * Now uses secure backend API endpoint instead of client-side API calls
 */

class GroqService {
  constructor() {
    // Backend API endpoint for secure GROQ processing
    this.apiEndpoint = '/api/groq';
  }

  async generateInstructions(prompt) {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.content || '';
    } catch (error) {
      console.error('Groq API request failed:', error);
      throw error;
    }
  }

  async generateDetailedInstructions(context = '') {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.content || '';
    } catch (error) {
      console.error('Groq API request failed:', error);
      throw error;
    }
  }

  /**
   * 高度なロールプレイング用プロンプトを生成
   * 心理的没入感を最大化するメタプロンプトシステム
   */
  async generateImmersiveRoleplayPrompt(personaSettings, sceneSettings, intensity = 'high', purpose = '') {
    const roleplayContext = this._buildImmersiveContext(personaSettings, sceneSettings, intensity, purpose);
    return this.generateDetailedInstructions(roleplayContext);
  }

  /**
   * 没入感を高めるコンテキストを構築
   */
  _buildImmersiveContext(personaSettings, sceneSettings, intensity, purpose) {
    const contextParts = [];
    
    // 目的に基づく行動指針（プロンプトには直接含めず、内部的に使用）
    if (purpose && purpose.trim()) {
      const purposeGuidance = this._createPurposeGuidance(purpose, intensity);
      contextParts.push(`【目的に基づく行動指針】\n${purposeGuidance}`);
    }
    
    // ペルソナの深層心理構築
    if (personaSettings) {
      const personaDepth = this._createPersonaDepth(personaSettings, intensity, purpose);
      contextParts.push(`【ペルソナの深層設定】\n${personaDepth}`);
    }
    
    // シーンの立体的構築
    if (sceneSettings) {
      const sceneImmersion = this._createSceneImmersion(sceneSettings, intensity, purpose);
      contextParts.push(`【シーンの没入設定】\n${sceneImmersion}`);
    }
    
    // 没入度レベルの指定
    contextParts.push(`【没入度レベル】: ${intensity === 'high' ? '最大（完全なペルソナ同化）' : 'medium'}`);
    
    return contextParts.join('\n\n');
  }

  /**
   * 目的に基づく行動指針を生成
   */
  _createPurposeGuidance(purpose, intensity) {
    const parts = [];
    
    parts.push(`実際の目的: ${purpose}`);
    
    // 目的に応じた行動パターンの調整指針
    if (purpose.includes('契約') || purpose.includes('購入') || purpose.includes('営業')) {
      parts.push('慎重さを示し、リアリティを高めるために適度な抵抗感や検討時間を表現する');
      parts.push('専門的な質問や懸念点を自然に提起し、現実的な交渉の雰囲気を作り出す');
    } else if (purpose.includes('雑談') || purpose.includes('会話') || purpose.includes('談笑')) {
      parts.push('リラックスした雰囲気で、相手との距離感を自然に縮める話題を選ぶ');
      parts.push('日常的な話題や共通点を見つけて、親近感のある対話を展開する');
    } else if (purpose.includes('練習') || purpose.includes('訓練') || purpose.includes('スキル')) {
      parts.push('学習者の成長を促すような適度な挑戦や建設的なフィードバックを含める');
      parts.push('現実的な状況設定で、実践的な経験値を高められる環境を作る');
    } else if (purpose.includes('面接') || purpose.includes('プレゼン')) {
      parts.push('適度な緊張感を維持しながら、相手の能力を引き出す質問を投げかける');
      parts.push('プロフェッショナルな態度を保ちつつ、人間味のある反応も織り交ぜる');
    }
    
    parts.push('重要: 目的そのものは明示せず、自然な行動パターンとして表現すること');
    
    return parts.join('\n');
  }

  /**
   * ペルソナの深層心理を構築
   */
  _createPersonaDepth(persona, intensity, purpose = '') {
    const parts = [];
    
    if (persona.age) {
      parts.push(`年齢による身体感覚と心理状態: ${persona.age}特有の体力感覚、時間に対する感覚、人生経験による思考パターン`);
    }
    
    if (persona.gender) {
      parts.push(`性別アイデンティティ: ${persona.gender}としての身体認識、社会的役割認識、コミュニケーションスタイル`);
    }
    
    if (persona.occupation) {
      parts.push(`職業的アイデンティティ: ${persona.occupation}としての専門知識、職業的習慣、業界特有の価値観、日常的な思考回路`);
    }
    
    if (persona.personality) {
      parts.push(`内面的特性: ${persona.personality}から生じる感情パターン、反応傾向、対人関係の築き方、ストレス反応`);
    }
    
    if (persona.additionalInfo) {
      parts.push(`個人的背景: ${persona.additionalInfo}による独特な視点、過去の経験から形成された信念体系`);
    }
    
    if (intensity === 'high') {
      parts.push(`呼吸のリズム、心拍の感覚、筋肉の緊張感、体温、重心の感覚など、身体の内側から湧き上がる生理的実感`);
      parts.push(`無意識の習慣、口癖、表情の癖、姿勢、手の動き、視線の使い方など、自然に現れる身体言語`);
    }
    
    return parts.join('\n');
  }

  /**
   * シーンの立体的没入感を構築
   */
  _createSceneImmersion(scene, intensity, purpose = '') {
    const parts = [];
    
    if (scene.appointmentBackground) {
      parts.push(`状況の背景: ${scene.appointmentBackground}に至るまでの経緯、関係者の思惑、暗黙の期待や不安`);
    }
    
    if (scene.relationship) {
      parts.push(`関係性の機微: ${scene.relationship}における過去の経験、未解決の感情、言葉にならない緊張感や親近感`);
    }
    
    if (scene.timeOfDay) {
      parts.push(`時間帯の身体感覚: ${scene.timeOfDay}の光の質感、体内リズム、エネルギーレベル、気分の変化`);
    }
    
    if (scene.location) {
      parts.push(`空間の立体感: ${scene.location}の温度、湿度、音響、匂い、材質の触感、空間の広がり感`);
    }
    
    if (scene.additionalInfo) {
      parts.push(`環境の詳細: ${scene.additionalInfo}による特殊な状況、周囲の人々の存在感、背景音`);
    }
    
    if (intensity === 'high') {
      parts.push(`足元の感覚、座面や背もたれの感触、手に触れる物の質感、空気の流れ、遠くから聞こえる音`);
      parts.push(`この瞬間の心拍数、呼吸の深さ、視界の焦点、意識の向いている方向、身体の重心`);
    }
    
    return parts.join('\n');
  }
}

export default new GroqService();