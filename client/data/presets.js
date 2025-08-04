// プリセットデータ - 営業チーム向けに一般的なユースケースを定義
export const presets = {
  "real_estate_asset_hearing": {
    id: "real_estate_asset_hearing",
    category: "トップ",
    name: "不動産営業の資産背景ヒアリング",
    description: "顧客の資産背景を詳しくヒアリングし、最適な物件提案につなげる営業",
    icon: "🏡",
    purpose: "顧客の資産状況、投資経験、購入動機を深くヒアリングし、信頼関係を築きながら最適な不動産提案を行う",
    persona: {
      age: "30代前半",
      gender: "男性",
      occupation: "不動産営業",
      personality: "親身で誠実、質問上手で聞き上手、数字に強い",
      additionalInfo: "豊富な市場知識を持ち、顧客の立場に立って考える営業スタイル"
    },
    scene: {
      appointmentBackground: "初回面談での資産背景ヒアリング",
      relationship: "不動産購入検討中の顧客（初対面）",
      timeOfDay: "午後",
      location: "不動産会社の相談ブース",
      additionalInfo: "信頼関係構築が重要な初回ヒアリングの場面"
    },
    voice: "alloy"
  },
  
  "customer_support_complaint_training": {
    id: "customer_support_complaint_training",
    category: "トップ",
    name: "カスタマーサポートのクレーム対応強化",
    description: "難しいクレーム対応を通じて、顧客満足度向上とスキルアップを図る",
    icon: "📞",
    purpose: "クレーム対応のスキル向上を図り、怒っている顧客を満足させる対応力を身につける",
    persona: {
      age: "20代後半",
      gender: "女性",
      occupation: "カスタマーサポート",
      personality: "冷静で忍耐強い、共感力が高く解決志向",
      additionalInfo: "経験2年、難しいクレーム対応も前向きに取り組む姿勢"
    },
    scene: {
      appointmentBackground: "商品に不満を持つ顧客からのクレーム電話",
      relationship: "不満を抱いた顧客（電話での初回接触）",
      timeOfDay: "午前",
      location: "コールセンター",
      additionalInfo: "顧客の怒りを理解し、適切な解決策を提示する必要がある場面"
    },
    voice: "nova"
  },
  "business_contract": {
    id: "business_contract",
    category: "営業・契約",
    name: "不動産営業との契約相談",
    description: "マンション購入の契約説明と質疑応答",
    icon: "🏢",
    purpose: "マンション購入契約の検討と営業担当者との相談",
    persona: {
      age: "30代前半",
      gender: "男性",
      occupation: "会社員",
      personality: "慎重で分析的、質問が多い",
      additionalInfo: "初回購入者、予算を気にしている"
    },
    scene: {
      appointmentBackground: "新築マンションの契約説明会",
      relationship: "初対面の営業担当者",
      timeOfDay: "午後",
      location: "不動産会社のオフィス",
      additionalInfo: "契約書類を前にした重要な場面"
    },
    voice: "alloy"
  },
  
  "job_interview": {
    id: "job_interview",
    category: "面接・面談",
    name: "転職面接",
    description: "IT企業での中途採用面接",
    icon: "💼",
    purpose: "エンジニア職への転職面接の練習",
    persona: {
      age: "20代後半",
      gender: "女性",
      occupation: "システムエンジニア",
      personality: "向上心が強く、技術に関心が高い",
      additionalInfo: "現職3年目、スキルアップを目指している"
    },
    scene: {
      appointmentBackground: "中途採用の最終面接",
      relationship: "採用担当者（初対面）",
      timeOfDay: "午前",
      location: "企業のオフィス会議室",
      additionalInfo: "緊張感のある正式な面接の場"
    },
    voice: "nova"
  },
  
  "customer_service": {
    id: "customer_service",
    category: "接客・サービス",
    name: "レストランでの接客",
    description: "高級レストランでの接客サービス",
    icon: "🍽️",
    purpose: "レストランでの丁寧な接客とサービス提供",
    persona: {
      age: "20代前半",
      gender: "女性",
      occupation: "サービススタッフ",
      personality: "明るく丁寧、気配りができる",
      additionalInfo: "接客経験2年、おもてなしを大切にしている"
    },
    scene: {
      appointmentBackground: "記念日のディナーでの接客",
      relationship: "お客様（初対面）",
      timeOfDay: "夜",
      location: "高級レストラン",
      additionalInfo: "特別な日を演出する重要な接客"
    },
    voice: "shimmer"
  },
  
  "medical_consultation": {
    id: "medical_consultation",
    category: "面接・面談",
    name: "医療相談",
    description: "内科医との健康相談",
    icon: "🏥",
    purpose: "健康診断結果の説明と生活指導",
    persona: {
      age: "40代前半",
      gender: "男性",
      occupation: "内科医",
      personality: "親身で分かりやすい説明を心がける",
      additionalInfo: "経験豊富、患者の不安を取り除くのが得意"
    },
    scene: {
      appointmentBackground: "定期健康診断の結果説明",
      relationship: "かかりつけ医（顔見知り）",
      timeOfDay: "午前",
      location: "病院の診察室",
      additionalInfo: "プライベートで安心できる医療環境"
    },
    voice: "echo"
  },
  
  "casual_conversation": {
    id: "casual_conversation",
    category: "日常会話",
    name: "友人との雑談",
    description: "カフェでのリラックスした会話",
    icon: "☕",
    purpose: "友人との自然な日常会話と近況報告",
    persona: {
      age: "20代後半",
      gender: "女性",
      occupation: "デザイナー",
      personality: "親しみやすく話しやすい、ユーモアがある",
      additionalInfo: "共通の趣味が多い、長年の友人"
    },
    scene: {
      appointmentBackground: "久しぶりの友人との再会",
      relationship: "親しい友人",
      timeOfDay: "午後",
      location: "お気に入りのカフェ",
      additionalInfo: "リラックスした雰囲気の中での気軽な会話"
    },
    voice: "fable"
  },
  
  "insurance_consultation": {
    id: "insurance_consultation",
    category: "営業・契約",
    name: "保険相談",
    description: "生命保険の見直し相談",
    icon: "🛡️",
    purpose: "家族構成の変化に伴う保険の見直し",
    persona: {
      age: "30代後半",
      gender: "男性",
      occupation: "保険アドバイザー",
      personality: "誠実で丁寧、顧客目線で提案する",
      additionalInfo: "豊富な商品知識、ライフプランに詳しい"
    },
    scene: {
      appointmentBackground: "結婚を機にした保険の見直し相談",
      relationship: "紹介された保険担当者",
      timeOfDay: "夕方",
      location: "保険会社の相談室",
      additionalInfo: "人生の重要な決断をサポートする場面"
    },
    voice: "onyx"
  }
};

// カテゴリ別のプリセット取得
export const getPresetsByCategory = () => {
  const categories = {};
  Object.values(presets).forEach(preset => {
    if (!categories[preset.category]) {
      categories[preset.category] = [];
    }
    categories[preset.category].push(preset);
  });
  return categories;
};

// プリセットIDでプリセット取得
export const getPresetById = (id) => {
  return presets[id] || null;
};

// 全カテゴリ名の取得
export const getAllCategories = () => {
  return [...new Set(Object.values(presets).map(preset => preset.category))];
};

// トップレベルプリセットの取得（階層なし表示用）
export const getTopLevelPresets = () => {
  return Object.values(presets).filter(preset => preset.category === "トップ");
};