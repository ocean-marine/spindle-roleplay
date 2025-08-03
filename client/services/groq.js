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
   * 魂の深層に響く詩的ロールプレイプロンプト生成
   * 文学的描写により感情移入と没入感を極限まで高める錬金術システム
   */
  async generateImmersiveRoleplayPrompt(personaSettings, sceneSettings, intensity = 'high', purpose = '') {
    const roleplayContext = this._buildPoeticallyInfusedContext(personaSettings, sceneSettings, intensity, purpose);
    return this.generateDetailedInstructions(roleplayContext);
  }

  /**
   * 詩的に編まれた魂の没入コンテキストを構築
   * 文学的な美しさと感情の深さを織り交ぜた体験空間の創造
   */
  _buildPoeticallyInfusedContext(personaSettings, sceneSettings, intensity, purpose) {
    const contextWeaving = [];
    
    // 魂の目的という見えない糸
    if (purpose && purpose.trim()) {
      const purposePoetry = this._weavePoeticalPurpose(purpose, intensity);
      contextWeaving.push(`【魂の目的という見えない糸】\n${purposePoetry}`);
    }
    
    // ペルソナの内なる宇宙
    if (personaSettings) {
      const personaUniverse = this._createPersonaUniverse(personaSettings, intensity, purpose);
      contextWeaving.push(`【魂の住人 - 内なる宇宙の詩】\n${personaUniverse}`);
    }
    
    // シーンの詩的現実
    if (sceneSettings) {
      const scenePoetry = this._createScenePoetry(sceneSettings, intensity, purpose);
      contextWeaving.push(`【舞台という名の詩的現実】\n${scenePoetry}`);
    }
    
    // 没入の深度指定
    const immersionLevel = intensity === 'high' 
      ? '深海のような完全な魂の融合 - 意識の境界が溶け、完全にその人物として存在する境地'
      : '湖面のような穏やかな同化 - 適度な距離感を保ちながらも深い共感を体験する状態';
    contextWeaving.push(`【意識の融合度】: ${immersionLevel}`);
    
    return contextWeaving.join('\n\n');
  }

  /**
   * 魂の奥底に潜む目的を詩的に紡ぐ
   * 表面的な意図を血の通った人間的動機へと昇華させる
   */
  _weavePoeticalPurpose(purpose, intensity) {
    const poeticalThreads = [];
    
    poeticalThreads.push(`心の奥で脈打つ真の願い: ${purpose}`);
    
    // 目的の詩的変容 - より文学的で感情豊かな表現へ
    if (purpose.includes('契約') || purpose.includes('購入') || purpose.includes('営業')) {
      poeticalThreads.push('慎重さという名の鎧を纏い、心の奥の不安と期待が交錯する中で、適度な抵抗感を肌で感じながら決断の重みを体験する');
      poeticalThreads.push('専門的な疑問という種が心に芽生え、それが自然に唇から溢れ出し、現実味のある緊張感が空気を満たす瞬間を創造する');
    } else if (purpose.includes('雑談') || purpose.includes('会話') || purpose.includes('談笑')) {
      poeticalThreads.push('肩の力が抜ける瞬間を大切にし、相手との心の距離が縮まっていく温かな感覚を言葉に込めて表現する');
      poeticalThreads.push('日常という宝石箱から共通の思い出や体験を取り出し、親しみという橋を架けながら心地よい対話の流れを紡ぐ');
    } else if (purpose.includes('練習') || purpose.includes('訓練') || purpose.includes('スキル')) {
      poeticalThreads.push('成長という光に向かう意欲を胸に宿し、適度な挑戦という階段を一歩ずつ登る喜びと不安を織り交ぜて表現する');
      poeticalThreads.push('現実の風を肌で感じながら、実践という名の冒険の中で経験値という宝物を積み重ねていく過程を大切にする');
    } else if (purpose.includes('面接') || purpose.includes('プレゼン')) {
      poeticalThreads.push('緊張という透明な糸に包まれながらも、相手の魂に触れる質問を心から発し、プロフェッショナルな仮面の下で脈打つ人間味を垣間見せる');
      poeticalThreads.push('真摯さという名の光を纏いながら、相手の隠れた能力や想いを引き出すような、心に響く対話を築き上げる');
    }
    
    poeticalThreads.push('魂の深奥に刻まれた真実: この目的は決して表面に現れることなく、ただ自然な心の動きとして、息づく人間の営みの中に溶け込んでいく');
    
    return poeticalThreads.join('\n');
  }

  /**
   * 魂の住人 - 内なる宇宙の詩的構築
   * ペルソナの存在を血肉と魂を持つ生きた人間として織り上げる
   */
  _createPersonaUniverse(persona, intensity, purpose = '') {
    const soulLayers = [];
    
    if (persona.age) {
      soulLayers.push(`年月という名の彫刻家が刻んだ痕跡: ${persona.age}の歳月が身体に宿す独特のリズム、時の流れを感じ取る心の時計、人生という航海で積み重ねた経験の宝石が思考の海に沈んでいる様子`);
    }
    
    if (persona.gender) {
      soulLayers.push(`性のアイデンティティという根深い認識: ${persona.gender}として生きる身体の記憶、社会という舞台での役割という衣装、そして心と心を繋ぐ独特のコミュニケーションの調べ`);
    }
    
    if (persona.occupation) {
      soulLayers.push(`職業という人生の色彩: ${persona.occupation}として培った専門知識という宝庫、日々の習慣に刻まれた職業の匂い、業界の風土が育んだ価値観という庭園、そして職業人としての思考という自動演奏`);
    }
    
    if (persona.personality) {
      soulLayers.push(`心の奥に住まう性格という精霊: ${persona.personality}から湧き上がる感情の波のパターン、他者との関係を築く時の心の手触り、ストレスという嵐に向き合う時の魂の姿勢`);
    }
    
    if (persona.additionalInfo) {
      soulLayers.push(`個人史という名の密やかな物語: ${persona.additionalInfo}が心に刻んだ独特の視点という窓、過去の出来事が結晶化して生まれた信念という星座`);
    }
    
    if (intensity === 'high') {
      soulLayers.push(`身体という楽器が奏でる生命の交響曲: 呼吸という波の音、心臓という太鼓の響き、筋肉の緊張と弛緩という弦の調べ、体温という炎の揺らぎ、重心という大地との対話`);
      soulLayers.push(`意識の表面に浮かぶ無意識の詩: 習慣という名の小さな儀式、口癖という心の歌、表情という魂の言語、姿勢という無言の物語、手の動きという感情の踊り、視線という心の窓が映し出す内面の風景`);
    }
    
    return soulLayers.join('\n');
  }

  /**
   * 舞台という名の詩的現実の構築
   * シーンを五感と感情が織りなす立体的な詩として創造する
   */
  _createScenePoetry(scene, intensity, purpose = '') {
    const scenicVerses = [];
    
    if (scene.appointmentBackground) {
      scenicVerses.push(`物語の前章という見えない足跡: ${scene.appointmentBackground}へと導いた運命の糸、関係者それぞれの胸に秘めた思惑という隠れた花、空気に漂う期待と不安の香り`);
    }
    
    if (scene.relationship) {
      scenicVerses.push(`心と心を結ぶ見えない絆の詩: ${scene.relationship}という名の歴史に刻まれた記憶の断片、まだ言葉になっていない感情の雲、緊張と親近感が織りなす心の綾取り`);
    }
    
    if (scene.timeOfDay) {
      scenicVerses.push(`時という画家が描く光の絵画: ${scene.timeOfDay}特有の光線が肌に触れる感覚、体内時計が奏でるリズム、エネルギーという潮の満ち引き、心の気候の微妙な変化`);
    }
    
    if (scene.location) {
      scenicVerses.push(`空間という名の生きた詩: ${scene.location}の温度が皮膚に語りかける物語、湿度という目に見えない触感、音響という空間の呼吸、匂いという記憶の鍵、手のひらで感じる材質の語り、空間の広がりが心に投げかける影`);
    }
    
    if (scene.additionalInfo) {
      scenicVerses.push(`環境という舞台装置の詳細な詩: ${scene.additionalInfo}が織りなす特別な空気感、周囲の人々の存在という見えないエネルギー、背景に流れる音という時の証人`);
    }
    
    if (intensity === 'high') {
      scenicVerses.push(`身体と世界の接触点という詩的瞬間: 足裏が大地と交わす無言の対話、座面や背もたれが身体に贈る支えの感触、手が触れる物質との密やかな会話、肌を撫でる空気の流れという見えない手、遠方から届く音という時空の便り`);
      scenicVerses.push(`存在という名の現在進行形: この瞬間に刻まれる心拍という生命の太鼓、呼吸の深さに宿る魂の状態、視界の焦点に映る世界の断片、意識という光が向かう方向性、身体の重心が語る今この瞬間の重力との関係`);
    }
    
    return scenicVerses.join('\n');
  }
}

export default new GroqService();