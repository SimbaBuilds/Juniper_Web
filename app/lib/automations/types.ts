export interface Automation {
  id: string;
  user_id: string;
  name: string;
  trigger_conditions: Record<string, unknown>;
  actions: Record<string, unknown>;
  is_active: boolean;
  execution_count: number;
  last_executed?: Date;
  notes?: string;
  created_at: Date;
  integrations: string[];
}

export interface HotPhrase {
  id: string;
  user_id: string;
  phrase: string;
  service_name: string;
  tool_name: string;
  description: string;
  is_built_in: boolean;
  is_active: boolean;
  execution_count: number;
  last_used?: Date;
  created_at: Date;
  updated_at: Date;
}