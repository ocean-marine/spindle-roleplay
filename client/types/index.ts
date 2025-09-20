// Common types
export type VoiceOption = 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse';

// Persona and Scene Settings
export interface PersonaSettings {
  age: string;
  gender: string;
  occupation: string;
  personality: string;
  additionalInfo: string;
  image?: string;
}

export interface SceneSettings {
  appointmentBackground: string;
  relationship: string;
  timeOfDay: string;
  location: string;
  additionalInfo: string;
}

// Event types
export interface RealtimeEvent {
  type: string;
  event_id?: string;
  timestamp?: string;
  item?: {
    type: string;
    role: string;
    content: Array<{
      type: string;
      text?: string;
      transcript?: string;
    }>;
  };
  [key: string]: any;
}

// Component Props
export interface SetupScreenProps {
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  instructions: string;
  setInstructions: (instructions: string) => void;
  purpose: string;
  setPurpose: (purpose: string) => void;
  personaSettings: PersonaSettings;
  setPersonaSettings: (settings: PersonaSettings) => void;
  sceneSettings: SceneSettings;
  setSceneSettings: (settings: SceneSettings) => void;
  startSession: () => Promise<void>;
  VOICE_OPTIONS: VoiceOption[];
  currentUser: string | null;
}

export interface ChatInterfaceProps {
  events: RealtimeEvent[];
  sendTextMessage: (message: string) => void;
  isSessionActive: boolean;
  isTyping: boolean;
  isMuted: boolean;
  toggleMute: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  audioLevel: number;
  personaSettings: PersonaSettings;
  sceneSettings: SceneSettings;
  purpose: string;
  onStopSession: () => void;
}

export interface LoginScreenProps {
  onLogin: (accountName: string) => void;
}

export interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactElement;
}








export interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (response: string) => void;
  title: string;
  message: string;
  placeholder?: string;
}



export interface PresetSelectorProps {
  onPresetSelect: (preset: PresetData) => void;
  onCustomize?: (preset: PresetData) => void;
  onDirectStart?: (preset: PresetData) => void;
  selectedPresetId: string;
  setSelectedPresetId: (id: string) => void;
  currentUser?: string | null;
  activeTab?: string;
}

export interface PresetData {
  id: string;
  name: string;
  purpose: string;
  instructions?: string;
  persona: PersonaSettings;
  scene: SceneSettings;
  voice?: string;
  icon?: string;
  category?: string;
  description?: string;
  predefinedInstructions?: string;
}

// API Response types
export interface TokenResponse {
  client_secret?: {
    value?: string;
  } | string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  accountName?: string;
  expiresIn?: number;
  error?: string;
}

// Admin Dashboard types
export interface CourseData {
  completed: number;
  inProgress: number;
  totalLearners: number;
  averageScore: number;
  completionRate: number;
  totalSessions: number;
  averageSessionTime: number;
  lastCompleted: string;
  activities: Activity[];
}

export interface Activity {
  id?: string | number;
  time?: string;
  user: string;
  action: string;
  result?: string;
  score?: number | null;
  date?: string;
  courseName?: string;
  courseIcon?: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  Icon: React.ComponentType<any>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface CourseCardProps {
  course: {
    name: string;
    id: string;
    icon?: string;
    description?: string;
  };
  progress: CourseData;
}

// Course Management types
export interface Course {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  category: string;
  objectives: string[];
  prerequisites: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseManagementProps {
  courses?: Course[];
  onAddCourse?: (course: Course) => void;
  onEditCourse?: (courseId: string, course: Course) => void;
  onDeleteCourse?: (courseId: string) => void;
}

// Team and Employee types
export interface TeamData {
  id: string;
  name: string;
  members: number;
  performance: number;
  completedCourses: number;
  averageScore: number;
}

export interface EmployeeData {
  id: string;
  name: string;
  email: string;
  team: string;
  role: string;
  joinDate: string;
  completedCourses: number;
  averageScore: number;
  lastActive: string;
}

// Voice Selection types
export interface VoiceCharacteristics {
  gender: 'male' | 'female' | 'neutral';
  ageRange: [number, number];
  personality: string[];
}

// Groq Service types
export interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Utility types
export type ViewMode = 'setup' | 'session' | 'history' | 'settings' | 'preset' | 'custom';
export type SessionStatus = 'idle' | 'connecting' | 'active' | 'error';

// App Component Types
export type AudioElementRef = React.MutableRefObject<HTMLAudioElement | null>;
export type PeerConnectionRef = React.MutableRefObject<RTCPeerConnection | null>;
export type MediaStreamTrackRef = React.MutableRefObject<MediaStreamTrack | null>;
export type HandleLogin = (accountName: string) => void;
export type HandleLogout = () => void;
export type HandleSessionStart = () => Promise<void>;
export type HandleSessionStop = () => void;
export type HandleMuteToggle = () => void;
export type HandleTextMessage = (message: string) => void;
export type DataChannelMessageHandler = (event: MessageEvent) => void;
export type DataChannelOpenHandler = () => void;
export type RTCTrackHandler = (event: RTCTrackEvent) => void;

// Form types
export type FormSubmitHandler = (e: React.FormEvent) => void;
export type InputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;
export type SelectChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => void;
export type TextAreaChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

// Other types
export type LoginResult = { success: boolean; accountName?: string; error?: string };
export type AuthStatus = { isAuthenticated: boolean; accountName: string | null };
export type LoginCredentials = { accountName: string; password: string };
export type ExpandableSectionProps = { title: string; children: React.ReactNode; defaultExpanded?: boolean; icon?: React.ComponentType<any> };
export type ImmersionLevel = 'low' | 'medium' | 'high';
export type PresetsByCategory = Record<string, PresetData[]>;