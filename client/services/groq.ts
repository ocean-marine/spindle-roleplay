/**
 * Groq API integration for Kimi K2 instruction generation
 * Now uses secure backend API endpoint instead of client-side API calls
 */

interface PersonaSettings {
  age?: string;
  gender?: string;
  occupation?: string;
  personality?: string;
  additionalInfo?: string;
}

interface SceneSettings {
  appointmentBackground?: string;
  relationship?: string;
  timeOfDay?: string;
  location?: string;
  additionalInfo?: string;
}

interface GroqApiResponse {
  content?: string;
  error?: string;
}

type IntensityLevel = 'high' | 'medium' | 'low';

class GroqService {
  private apiEndpoint: string;

  constructor() {
    // Backend API endpoint for secure GROQ processing
    this.apiEndpoint = '/api/groq';
  }

  async generateInstructions(prompt: string): Promise<string> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const errorData: GroqApiResponse = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: GroqApiResponse = await response.json();
      return data.content || '';
    } catch (error) {
      console.error('Groq API request failed:', error);
      throw error;
    }
  }

  async generateDetailedInstructions(context: string = ''): Promise<string> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context })
      });

      if (!response.ok) {
        const errorData: GroqApiResponse = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: GroqApiResponse = await response.json();
      return data.content || '';
    } catch (error) {
      console.error('Groq API request failed:', error);
      throw error;
    }
  }

  /**
   * ロールプレイ用のプロンプトを生成
   */
  async generateRoleplayPrompt(
    personaSettings: PersonaSettings, 
    sceneSettings: SceneSettings, 
    intensity: IntensityLevel = 'high', 
    purpose: string = ''
  ): Promise<string> {
    const roleplayContext = this._buildRoleplayContext(personaSettings, sceneSettings, intensity, purpose);
    return this.generateDetailedInstructions(roleplayContext);
  }

  /**
   * 没入型ロールプレイ用のプロンプトを生成
   */
  async generateImmersiveRoleplayPrompt(
    personaSettings: PersonaSettings, 
    sceneSettings: SceneSettings, 
    intensity: IntensityLevel = 'high', 
    purpose: string = ''
  ): Promise<string> {
    const roleplayContext = this._buildImmersiveRoleplayContext(personaSettings, sceneSettings, intensity, purpose);
    return this.generateDetailedInstructions(roleplayContext);
  }

  /**
   * ロールプレイ用のコンテキストを構築
   */
  private _buildRoleplayContext(
    personaSettings: PersonaSettings, 
    sceneSettings: SceneSettings, 
    intensity: IntensityLevel, 
    purpose: string
  ): string {
    const contextParts: string[] = [];
    
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
   * 没入型ロールプレイ用のコンテキストを構築
   */
  private _buildImmersiveRoleplayContext(
    personaSettings: PersonaSettings, 
    sceneSettings: SceneSettings, 
    intensity: IntensityLevel, 
    purpose: string
  ): string {
    const contextParts: string[] = [];
    
    // 目的
    if (purpose && purpose.trim()) {
      const purposeText = this._weavePoeticalPurpose(purpose, intensity);
      contextParts.push(`【目的】\n${purposeText}`);
    }
    
    // ペルソナ設定
    if (personaSettings) {
      const personaText = this._buildPersona(personaSettings, intensity, purpose);
      contextParts.push(`【人物設定】\n${personaText}`);
    }
    
    // シーン設定
    if (sceneSettings) {
      const sceneText = this._createScenePoetry(sceneSettings, intensity, purpose);
      contextParts.push(`【シーン設定】\n${sceneText}`);
    }
    
    // 没入度（より詳細）
    const immersionLevel = intensity === 'high' 
      ? '最高没入度 - その人物の意識そのものになりきり、思考・感情・身体感覚すべてを体現する'
      : '高没入度 - その人物の心理状態と身体感覚を理解して深く共感しながら応答する';
    contextParts.push(`【没入度】: ${immersionLevel}`);
    
    return contextParts.join('\n\n');
  }

  /**
   * 基本的な目的を構築
   */
  private _buildPurpose(purpose: string, intensity: IntensityLevel): string {
    const purposeParts: string[] = [];
    
    purposeParts.push(`目的: ${purpose}`);
    
    // 目的に応じた基本的な行動指針
    if (purpose.includes('契約') || purpose.includes('購入') || purpose.includes('営業')) {
      purposeParts.push('慎重に検討し、必要に応じて質問をする');
    } else if (purpose.includes('雑談') || purpose.includes('会話')) {
      purposeParts.push('リラックスした雰囲気で自然な会話をする');
    } else if (purpose.includes('練習') || purpose.includes('訓練')) {
      purposeParts.push('学習意欲を持って積極的に参加する');
    } else if (purpose.includes('面接') || purpose.includes('プレゼン')) {
      purposeParts.push('真摯な態度で相手に関心を示す');
    }
    
    return purposeParts.join('\n');
  }

  /**
   * シーン設定を構築
   */
  private _buildScene(scene: SceneSettings, intensity: IntensityLevel, purpose: string = ''): string {
    const sceneParts: string[] = [];
    
    if (scene.appointmentBackground) {
      sceneParts.push(`背景: ${scene.appointmentBackground}`);
    }
    
    if (scene.relationship) {
      sceneParts.push(`関係性: ${scene.relationship}`);
    }
    
    if (scene.timeOfDay) {
      sceneParts.push(`時間帯: ${scene.timeOfDay}`);
    }
    
    if (scene.location) {
      sceneParts.push(`場所: ${scene.location}`);
    }
    
    if (scene.additionalInfo) {
      sceneParts.push(`追加情報: ${scene.additionalInfo}`);
    }
    
    return sceneParts.join('\n');
  }

  /**
   * 魂の奥底に潜む目的を詩的に紡ぐ
   * 表面的な意図を血の通った人間的動機へと昇華させる
   */
  private _weavePoeticalPurpose(purpose: string, intensity: IntensityLevel): string {
    const purposeParts: string[] = [];
    
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
   * ペルソナ情報を構築
   */
  private _buildPersona(persona: PersonaSettings, intensity: IntensityLevel, purpose: string = ''): string {
    const personaParts: string[] = [];
    
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
   * 舞台という名の詩的現実の構築
   * シーンを五感と感情が織りなす立体的な詩として創造する
   */
  private _createScenePoetry(scene: SceneSettings, intensity: IntensityLevel, purpose: string = ''): string {
    const sceneParts: string[] = [];
    
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
}

export default new GroqService();