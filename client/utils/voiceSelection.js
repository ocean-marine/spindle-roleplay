// Voice selection utilities based on age and gender according to research findings

/**
 * Voice characteristics mapping based on the research documentation provided
 */
const VOICE_CHARACTERISTICS = {
  // Feminine/young voices
  juniper: { gender: 'feminine', age: 'young', traits: ['open', 'upbeat'] },
  breeze: { gender: 'neutral', age: 'young', traits: ['animated', 'earnest'] },
  maple: { gender: 'feminine', age: 'medium', traits: ['cheerful', 'candid'] },
  vale: { gender: 'feminine', age: 'young', traits: ['bright', 'inquisitive'] },
  
  // Masculine/neutral voices
  ember: { gender: 'masculine', age: 'medium', traits: ['confident', 'optimistic'] },
  cove: { gender: 'masculine', age: 'mature', traits: ['composed', 'direct'] },
  sol: { gender: 'neutral', age: 'mature', traits: ['savvy', 'relaxed'] },
  spruce: { gender: 'masculine', age: 'mature', traits: ['calm', 'affirming'] },
  arbor: { gender: 'neutral', age: 'medium', traits: ['easygoing', 'versatile'] },
  
  // Fallback options (using available voices if research voices not available)
  alloy: { gender: 'neutral', age: 'medium', traits: ['balanced'] },
  ash: { gender: 'neutral', age: 'medium', traits: ['balanced'] },
  ballad: { gender: 'neutral', age: 'medium', traits: ['balanced'] },
  coral: { gender: 'feminine', age: 'medium', traits: ['warm'] },
  echo: { gender: 'masculine', age: 'medium', traits: ['resonant'] },
  fable: { gender: 'neutral', age: 'medium', traits: ['storytelling'] },
  nova: { gender: 'feminine', age: 'young', traits: ['energetic'] },
  sage: { gender: 'neutral', age: 'mature', traits: ['wise'] },
  shimmer: { gender: 'feminine', age: 'young', traits: ['bright'] },
  verse: { gender: 'neutral', age: 'medium', traits: ['rhythmic'] }
};

/**
 * Rule-based voice selection based on persona age and gender
 * @param {string} age - Age range from persona settings
 * @param {string} gender - Gender from persona settings
 * @param {Array} availableVoices - List of available voice options
 * @returns {string} Selected voice name
 */
export function selectVoiceByRules(age, gender, availableVoices = []) {
  if (!age && !gender) {
    // Default fallback
    return availableVoices.includes('alloy') ? 'alloy' : availableVoices[0];
  }

  // Age mapping
  const ageCategory = getAgeCategory(age);
  const genderCategory = getGenderCategory(gender);

  // Priority voice candidates based on age and gender
  let candidates = [];

  if (genderCategory === 'feminine') {
    if (ageCategory === 'young') {
      candidates = ['juniper', 'vale', 'nova', 'shimmer', 'breeze'];
    } else if (ageCategory === 'medium') {
      candidates = ['maple', 'coral', 'juniper'];
    } else { // mature
      candidates = ['maple', 'coral', 'sage'];
    }
  } else if (genderCategory === 'masculine') {
    if (ageCategory === 'young') {
      candidates = ['ember', 'breeze', 'echo'];
    } else if (ageCategory === 'medium') {
      candidates = ['ember', 'cove', 'echo'];
    } else { // mature
      candidates = ['cove', 'spruce', 'sage'];
    }
  } else { // neutral or other
    if (ageCategory === 'young') {
      candidates = ['breeze', 'vale', 'arbor'];
    } else if (ageCategory === 'medium') {
      candidates = ['sol', 'arbor', 'alloy', 'fable'];
    } else { // mature
      candidates = ['sol', 'spruce', 'sage'];
    }
  }

  // Find first available candidate from priority list
  for (const candidate of candidates) {
    if (availableVoices.includes(candidate)) {
      return candidate;
    }
  }

  // Fallback to gender-appropriate voices if specific ones not available
  const fallbackByGender = getFallbackVoicesByGender(genderCategory, availableVoices);
  if (fallbackByGender.length > 0) {
    return fallbackByGender[0];
  }

  // Final fallback
  return availableVoices.includes('alloy') ? 'alloy' : availableVoices[0];
}

/**
 * Get age category from Japanese age string
 * @param {string} age - Age string like "20代前半", "30代後半"
 * @returns {string} 'young', 'medium', or 'mature'
 */
function getAgeCategory(age) {
  if (!age) return 'medium';
  
  if (age.includes('20代') || age.includes('10代')) {
    return 'young';
  } else if (age.includes('30代') || age.includes('40代前半')) {
    return 'medium';
  } else {
    return 'mature';
  }
}

/**
 * Get gender category from Japanese gender string
 * @param {string} gender - Gender string like "男性", "女性", "その他"
 * @returns {string} 'masculine', 'feminine', or 'neutral'
 */
function getGenderCategory(gender) {
  if (!gender) return 'neutral';
  
  if (gender === '女性') {
    return 'feminine';
  } else if (gender === '男性') {
    return 'masculine';
  } else {
    return 'neutral';
  }
}

/**
 * Get fallback voices by gender category
 * @param {string} genderCategory - 'masculine', 'feminine', or 'neutral'
 * @param {Array} availableVoices - Available voice options
 * @returns {Array} Array of suitable voice names
 */
function getFallbackVoicesByGender(genderCategory, availableVoices) {
  const feminineFallbacks = ['coral', 'nova', 'shimmer'];
  const masculineFallbacks = ['echo', 'ash'];
  const neutralFallbacks = ['alloy', 'fable', 'sage'];

  let fallbacks;
  if (genderCategory === 'feminine') {
    fallbacks = feminineFallbacks;
  } else if (genderCategory === 'masculine') {
    fallbacks = masculineFallbacks;
  } else {
    fallbacks = neutralFallbacks;
  }

  return fallbacks.filter(voice => availableVoices.includes(voice));
}

/**
 * Get voice description for UI display
 * @param {string} voiceName - Name of the voice
 * @returns {string} Description of the voice characteristics
 */
export function getVoiceDescription(voiceName) {
  const characteristics = VOICE_CHARACTERISTICS[voiceName];
  if (!characteristics) return '';

  const genderText = characteristics.gender === 'feminine' ? '女性的' : 
                    characteristics.gender === 'masculine' ? '男性的' : '中性的';
  const ageText = characteristics.age === 'young' ? '若々しい' :
                  characteristics.age === 'mature' ? '落ち着いた' : '標準的';
  
  return `${genderText}・${ageText}な声質`;
}