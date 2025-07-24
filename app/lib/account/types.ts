export interface UserProfile {
  id: string;
  display_name?: string;
  name?: string;
  location?: string;
  education?: string;
  profession?: string;
  email: string;
  phone?: string;
  timezone: string;
  base_language_model: string;
  deepgram_enabled: boolean;
  deepgram_voice?: string;
  wake_word?: string;
  wake_word_sensitivity: number;
  wake_word_enabled: boolean;
  xai_live_search_enabled: boolean;
  xai_live_search_safe_search: boolean;
  general_instructions?: string;
  requests_today: number;
  requests_week: number;
  requests_month: number;
  user_tags: string[];
  preferences: Record<string, unknown>;
  enabled_integrations: Record<string, boolean>;
  created_at: Date;
  updated_at: Date;
}

export interface SubscriptionInfo {
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  requests_limit: number;
  requests_used: number;
}

export const AVAILABLE_MODELS = [
  { value: 'grok-3', label: 'Grok 3' },
  { value: 'o3-mini-2025-01-31', label: 'O3 Mini' },
  { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' }
] as const;

export const AVAILABLE_VOICES = [
  'Mars', 'Apollo', 'Arcas', 'Stella', 'Luna', 'Cosmos'
] as const;

export const WAKE_WORDS = [
  'Hey Jarvis', 'Hey Juni', 'Alexa', 'Computer', 'Assistant'
] as const;