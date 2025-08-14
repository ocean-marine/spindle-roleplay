// Voice selection utilities based on age and gender according to research findings
import type { VoiceOption } from "../types";

type GenderCategory = 'masculine' | 'feminine' | 'neutral';
type AgeCategory = 'young' | 'medium' | 'mature';

interface VoiceCharacteristics {
  gender: GenderCategory;
  age: AgeCategory;
  traits: string[];
}

/**
 * Voice characteristics mapping based on the research documentation provided
 */
const VOICE_CHARACTERISTICS: Record<string, VoiceCharacteristics> = {
  // OpenAI API supported voices only
  alloy: { gender: 'neutral', age: 'medium', traits: ['balanced', 'versatile'] },
  ash: { gender: 'neutral', age: 'medium', traits: ['calm', 'steady'] },
  ballad: { gender: 'neutral', age: 'medium', traits: ['smooth', 'melodic'] },
  coral: { gender: 'feminine', age: 'medium', traits: ['warm', 'friendly'] },
  echo: { gender: 'masculine', age: 'medium', traits: ['resonant', 'clear'] },
  sage: { gender: 'neutral', age: 'mature', traits: ['wise', 'thoughtful'] },
  shimmer: { gender: 'feminine', age: 'young', traits: ['bright', 'energetic'] },
  verse: { gender: 'neutral', age: 'medium', traits: ['rhythmic', 'expressive'] }
};

/**
 * Rule-based voice selection based on persona age and gender
 */
export function selectVoiceByRules(
  age: string, 
  gender: string, 
  availableVoices: readonly VoiceOption[] = []
): VoiceOption {
  if (!age && !gender) {
    // Default fallback
    return availableVoices.includes('alloy') ? 'alloy' : availableVoices[0];
  }

  // Age mapping
  const ageCategory = getAgeCategory(age);
  const genderCategory = getGenderCategory(gender);

  // Priority voice candidates based on age and gender
  let candidates: string[] = [];

  if (genderCategory === 'feminine') {
    if (ageCategory === 'young') {
      candidates = ['shimmer', 'coral', 'ballad'];
    } else if (ageCategory === 'medium') {
      candidates = ['coral', 'ballad', 'sage'];
    } else { // mature
      candidates = ['sage', 'coral', 'ballad'];
    }
  } else if (genderCategory === 'masculine') {
    if (ageCategory === 'young') {
      candidates = ['echo', 'ash', 'alloy'];
    } else if (ageCategory === 'medium') {
      candidates = ['echo', 'ash', 'alloy'];
    } else { // mature
      candidates = ['ash', 'echo', 'sage'];
    }
  } else { // neutral or other
    if (ageCategory === 'young') {
      candidates = ['alloy', 'verse', 'ballad'];
    } else if (ageCategory === 'medium') {
      candidates = ['alloy', 'verse', 'sage'];
    } else { // mature
      candidates = ['sage', 'alloy', 'verse'];
    }
  }

  // Find first available candidate from priority list
  for (const candidate of candidates) {
    if (availableVoices.includes(candidate as VoiceOption)) {
      return candidate as VoiceOption;
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
 */
function getAgeCategory(age: string): AgeCategory {
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
 */
function getGenderCategory(gender: string): GenderCategory {
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
 */
function getFallbackVoicesByGender(
  genderCategory: GenderCategory, 
  availableVoices: readonly VoiceOption[]
): VoiceOption[] {
  const feminineFallbacks: string[] = ['coral', 'shimmer', 'ballad'];
  const masculineFallbacks: string[] = ['echo', 'ash', 'alloy'];
  const neutralFallbacks: string[] = ['alloy', 'verse', 'sage'];

  let fallbacks: string[];
  if (genderCategory === 'feminine') {
    fallbacks = feminineFallbacks;
  } else if (genderCategory === 'masculine') {
    fallbacks = masculineFallbacks;
  } else {
    fallbacks = neutralFallbacks;
  }

  return fallbacks.filter(voice => availableVoices.includes(voice as VoiceOption)) as VoiceOption[];
}

/**
 * Get voice description for UI display
 */
export function getVoiceDescription(voiceName: string): string {
  const characteristics = VOICE_CHARACTERISTICS[voiceName];
  if (!characteristics) return '';

  const genderText = characteristics.gender === 'feminine' ? '女性的' : 
                    characteristics.gender === 'masculine' ? '男性的' : '中性的';
  const ageText = characteristics.age === 'young' ? '若々しい' :
                  characteristics.age === 'mature' ? '落ち着いた' : '標準的';
  
  return `${genderText}・${ageText}な声質`;
}