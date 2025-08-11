// OpenAI Realtime API Type Definitions

export interface RealtimeEvent {
  type: string;
  event_id: string;
  [key: string]: any;
}

export interface RealtimeClient {
  connect(): Promise<void>;
  disconnect(): void;
  sendEvent(event: RealtimeEvent): void;
  on(event: string, handler: (data: any) => void): void;
}

export interface PersonaConfig {
  age?: number;
  gender?: string;
  profession?: string;
  personality?: string;
  name?: string;
  background?: string;
  instructions?: string;
  occupation?: string;
  additionalInfo?: string;
  image?: string;
}

export interface SceneConfig {
  background?: string;
  relationship?: string;
  time?: string;
  location?: string;
  context?: string;
  objectives?: string;
  appointmentBackground?: string;
  timeOfDay?: string;
  additionalInfo?: string;
}

export interface PresetConfig {
  id: string;
  name: string;
  category: string;
  description?: string;
  icon?: string;
  purpose?: string;
  persona: PersonaConfig;
  scene: SceneConfig;
  instructions?: string;
  predefinedInstructions?: string;
  voice?: string;
}

export interface SessionConfig {
  persona?: PersonaConfig;
  scene?: SceneConfig;
  voice?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface SessionHistory {
  id: string;
  name: string;
  timestamp: number;
  messages: ChatMessage[];
  config: SessionConfig;
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: string;
  description?: string;
}

export interface AudioConfig {
  sampleRate: number;
  channels: number;
  bitrate?: number;
}