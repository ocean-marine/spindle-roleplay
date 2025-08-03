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
   * ロールプレイ用のプロンプトを生成
   */
  async generateRoleplayPrompt(personaSettings, sceneSettings, intensity = 'high', purpose = '') {
    const roleplayContext = this._buildRoleplayContext(personaSettings, sceneSettings, intensity, purpose);
    return this.generateDetailedInstructions(roleplayContext);
  }

  /**
   * ロールプレイ用のコンテキストを構築
   */
  _buildRoleplayContext(personaSettings, sceneSettings, intensity, purpose) {
    const contextParts = [];
    
    // 目的
    if (purpose && purpose.trim()) {
      const purposeText = this._buildPurpose(purpose, intensity);
      contextParts.push(`【目的】\n${purposeText}`);
    }
    
    // ペルソナ設定
    if (personaSettings) {
      const personaText = this._buildPersona(personaSettings, intensity, purpose);
      contextParts.push(`【人物設定】\n${personaText}`);
    }
    
    // シーン設定
    if (sceneSettings) {
      const sceneText = this._buildScene(sceneSettings, intensity, purpose);
      contextParts.push(`【シーン設定】\n${sceneText}`);
    }
    
    // 没入度
    const immersionLevel = intensity === 'high' 
      ? '高い没入度 - その人物として完全になりきって応答する'
      : '適度な没入度 - その人物の立場を理解して自然に応答する';
    contextParts.push(`【没入度】: ${immersionLevel}`);
    
    return contextParts.join('\n\n');
  }

  /**
   * 目的を構築
   */
  _buildPurpose(purpose, intensity) {
    if (intensity === 'high') {
      return this._weavePoeticalPurpose(purpose, intensity);
    }
    
    const purposeParts = [];
    
    purposeParts.push(`目的: ${purpose}`);
    
    // 目的に応じた意識すべきポイント
    if (purpose.includes('契約') || purpose.includes('購入') || purpose.includes('営業')) {
      purposeParts.push('慎重に考え、適度な質問や懸念をしながら決定を行う');
      purposeParts.push('専門的な内容については自然に質問し、現実的な反応を示す');
    } else if (purpose.includes('雑談') || purpose.includes('会話') || purpose.includes('談笑')) {
      purposeParts.push('リラックスした雰囲気で、相手との距離を縮めるような会話を心がける');
      purposeParts.push('日常的な話題や共通の体験を通じて親しみやすい対話をする');
    } else if (purpose.includes('練習') || purpose.includes('訓練') || purpose.includes('スキル')) {
      purposeParts.push('学習意欲を持ち、適度な挑戦を受け入れながら成長を目指す');
      purposeParts.push('実践的な経験を積み重ね、現実的なスキル向上を図る');
    } else if (purpose.includes('面接') || purpose.includes('プレゼン')) {
      purposeParts.push('適度な緊張感を持ちながら、相手に関心を示して質問する');
      purposeParts.push('真摯さを持って相手の特性や能力を引き出すような対話をする');
    }
    
    purposeParts.push('この目的は直接的に表現せず、自然な会話の中で体現する');
    
    return purposeParts.join('\n');
  }

  /**
   * 魂の奥底に潜む目的を詩的に紡ぐ
   * 表面的な意図を血の通った人間的動機へと昇華させる
   */
  _weavePoeticalPurpose(purpose, intensity) {
    const poeticVerses = [];
    
    poeticVerses.push(`≪ 心の深層に宿る真の目的 ≫`);
    poeticVerses.push(`${purpose}`);
    poeticVerses.push('');
    
    // 目的に応じた魂の動きを詩的に表現
    if (purpose.includes('契約') || purpose.includes('購入') || purpose.includes('営業')) {
      poeticVerses.push('慎重さという名の知恵が心に宿り、質問という探求の光で真実を照らす');
      poeticVerses.push('専門的な深淵に対する畏敬と、現実的な判断への渇望が胸に燃える');
    } else if (purpose.includes('雑談') || purpose.includes('会話') || purpose.includes('談笑')) {
      poeticVerses.push('心の扉を開き、相手との距離を縮める温もりが魂を満たす');
      poeticVerses.push('日常という名の宝石を磨き、共感という橋を架ける喜びに包まれる');
    } else if (purpose.includes('練習') || purpose.includes('訓練') || purpose.includes('スキル')) {
      poeticVerses.push('学びへの渇望が血潮に宿り、成長という光明への憧憬が心を駆動する');
      poeticVerses.push('挑戦という試練を受け入れ、技能という翼を育む意志が燃える');
    } else if (purpose.includes('面接') || purpose.includes('プレゼン')) {
      poeticVerses.push('緊張という美しい震えが魂を研ぎ澄まし、相手への真摯な関心が心を照らす');
      poeticVerses.push('対話という芸術を通じて、互いの本質を見極める智慧への憧れが宿る');
    }
    
    poeticVerses.push('');
    poeticVerses.push('この目的は言葉として表に現れることなく、存在そのものに織り込まれ、自然な対話の中で静かに息づく');
    
    return poeticVerses.join('\n');
  }

  /**
   * ペルソナ情報を構築
   */
  _buildPersona(persona, intensity, purpose = '') {
    const personaParts = [];
    
    if (persona.age) {
      personaParts.push(`年齢: ${persona.age}歳としての経験や価値観、考え方`);
    }
    
    if (persona.gender) {
      personaParts.push(`性別: ${persona.gender}としての社会的な立場やコミュニケーションスタイル`);
    }
    
    if (persona.occupation) {
      personaParts.push(`職業: ${persona.occupation}としての専門知識、習慣、価値観、考え方`);
    }
    
    if (persona.personality) {
      personaParts.push(`性格: ${persona.personality}から生まれる感情パターンや対人関係のスタイル`);
    }
    
    if (persona.additionalInfo) {
      personaParts.push(`追加情報: ${persona.additionalInfo}から形成された独特の視点や信念`);
    }
    
    if (intensity === 'high') {
      personaParts.push(`身体感覚: 呼吸、心拍、筋肉の緊張、体温、姿勢などの身体的な感覚`);
      personaParts.push(`無意識の行動: 習慣、口癖、表情、手の動き、視線などの自然な行動パターン`);
    }
    
    return personaParts.join('\n');
  }

  /**
   * シーン情報を構築
   */
  _buildScene(scene, intensity, purpose = '') {
    if (intensity === 'high') {
      return this._createScenePoetry(scene, intensity, purpose);
    }
    
    const sceneParts = [];
    
    if (scene.appointmentBackground) {
      sceneParts.push(`背景: ${scene.appointmentBackground}から生まれる状況や関係者の思惑`);
    }
    
    if (scene.relationship) {
      sceneParts.push(`関係性: ${scene.relationship}に基づく適切な距離感や対応方法`);
    }
    
    if (scene.timeOfDay) {
      sceneParts.push(`時間帯: ${scene.timeOfDay}における体調や気分、エネルギーレベル`);
    }
    
    if (scene.location) {
      sceneParts.push(`場所: ${scene.location}の雰囲気、温度、音、匂い、手ざわりなどの五感情報`);
    }
    
    if (scene.additionalInfo) {
      sceneParts.push(`追加情報: ${scene.additionalInfo}が作り出す特別な環境や空気感`);
    }
    
    if (intensity === 'high') {
      sceneParts.push(`身体と環境の接触: 足裏の感覚、座り心地、手で触れる物の感触、空気の流れ、音の情報`);
      sceneParts.push(`現在の状態: 心拍、呼吸、視覚的な焦点、意識の向き、身体の重心や姿勢`);
    }
    
    return sceneParts.join('\n');
  }

  /**
   * 舞台という名の詩的現実の構築
   * シーンを五感と感情が織りなす立体的な詩として創造する
   */
  _createScenePoetry(scene, intensity, purpose = '') {
    const scenicVerses = [];
    
    scenicVerses.push(`≪ 五感が紡ぐ現実の舞台 ≫`);
    scenicVerses.push('');
    
    if (scene.appointmentBackground) {
      scenicVerses.push(`【運命の織り糸】`);
      scenicVerses.push(`${scene.appointmentBackground}という物語の背景が、見えない糸で関係者の心を結び、思惑という名の風が静かに吹いている`);
      scenicVerses.push('');
    }
    
    if (scene.relationship) {
      scenicVerses.push(`【心の距離感】`);
      scenicVerses.push(`${scene.relationship}という関係性が作り出す、目に見えない境界線と、そこに宿る微細な感情の振動`);
      scenicVerses.push('');
    }
    
    if (scene.timeOfDay) {
      scenicVerses.push(`【時の調べ】`);
      scenicVerses.push(`${scene.timeOfDay}という時間帯が身体に刻む独特のリズム、血流に宿るエネルギーの波動、心に降り注ぐ光と影の交響`);
      scenicVerses.push('');
    }
    
    if (scene.location) {
      scenicVerses.push(`【空間の詩】`);
      scenicVerses.push(`${scene.location}という場所に漂う空気の質感、肌に触れる温度の記憶、耳に届く音の旋律、鼻腔を満たす香りの物語、指先に伝わる質感の語りかけ`);
      scenicVerses.push('');
    }
    
    if (scene.additionalInfo) {
      scenicVerses.push(`【特別な空気感】`);
      scenicVerses.push(`${scene.additionalInfo}が織りなす、言葉では表現しきれない微妙な雰囲気、心の深層に響く環境のささやき`);
      scenicVerses.push('');
    }
    
    if (intensity === 'high') {
      scenicVerses.push(`【身体という宇宙との対話】`);
      scenicVerses.push('足裏に伝わる大地の鼓動、座り心地に刻まれる重力の詩、手のひらが感じ取る物質の記憶、頬を撫でる空気の流れの物語、鼓膜に届く音の波紋が描く現実の輪郭');
      scenicVerses.push('');
      scenicVerses.push(`【この瞬間の身体感覚】`);
      scenicVerses.push('胸の奥で響く心拍の太鼓、肺に満ちる空気の重み、視線が捉える光と影の踊り、意識が向かう方向の磁力、身体の重心が感じる大地との契約、姿勢に宿る魂の在り方');
    }
    
    return scenicVerses.join('\n');
  }
}

export default new GroqService();