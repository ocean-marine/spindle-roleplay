// Common types
export type VoiceOption = 'alloy' | 'nova' | 'echo' | 'fable' | 'onyx' | 'shimmer' | 'verse' | 'ash' | 'ballad' | 'coral' | 'sage' | 'juniper' | 'breeze' | 'maple' | 'vale' | 'ember' | 'cove' | 'sol' | 'spruce' | 'arbor';

// Persona and Scene Settings
export interface PersonaSettings {
  age: string;
  gender: string;
  occupation: string;
  personality: string;
  additionalInfo: string;
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
  VOICE_OPTIONS: string[];
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
}

export interface VoiceInterfaceProps {
  isSessionActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  audioLevel: number;
}

export interface SessionControlsProps {
  isSessionActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  onStartSession: () => void;
  onStopSession: () => void;
}

export interface EventLogProps {
  events: RealtimeEvent[];
}

export interface ToolPanelProps {
  selectedVoice: string;
  instructions: string;
  personaSettings: PersonaSettings;
  sceneSettings: SceneSettings;
  purpose: string;
}

export interface TabNavigationProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: React.ComponentType;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export interface SwipeHandlerProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  children: React.ReactNode;
}

export interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (response: string) => void;
  title: string;
  message: string;
  placeholder?: string;
}

export interface HistoryScreenProps {
  sessions: Array<{
    id: string;
    date: string;
    duration: string;
    persona: PersonaSettings;
    scene: SceneSettings;
  }>;
  onSelectSession: (sessionId: string) => void;
}

export interface SettingsScreenProps {
  currentUser: string | null;
  onLogout: () => void;
}

export interface PresetSelectorProps {
  onSelect: (preset: PresetData) => void;
  currentUser?: string | null;
}

export interface PresetData {
  id: string;
  name: string;
  purpose: string;
  instructions: string;
  persona: PersonaSettings;
  scene: SceneSettings;
  voice?: string;
  icon?: string;
  category?: string;
  description?: string;
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
  time: string;
  user: string;
  action: string;
  result?: string;
  score?: number;
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
export type ViewMode = 'setup' | 'session' | 'history' | 'settings';
export type SessionStatus = 'idle' | 'connecting' | 'active' | 'error';