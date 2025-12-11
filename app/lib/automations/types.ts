// Types matching the automation_records table structure

export interface AutomationAction {
  id: string;
  tool: string;
  parameters: Record<string, unknown>;
  output_as?: string;
  condition?: {
    op?: string;
    path?: string;
    value?: unknown;
    operator?: 'AND' | 'OR';
    clauses?: Array<{
      op: string;
      path: string;
      value: unknown;
    }>;
  };
}

export interface TriggerConfig {
  service?: string;
  event_type?: string;
  event_types?: string[];
  interval?: string;
  time_of_day?: string;
  run_at?: string;
  poll_interval?: string;
  filters?: Record<string, unknown>;
}

export interface AutomationRecord {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  trigger_type: 'webhook' | 'schedule_recurring' | 'schedule_once' | 'manual' | 'polling';
  trigger_config: TriggerConfig;
  script_code: string | null;
  execution_params: Record<string, unknown>;
  dependencies: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
  actions: AutomationAction[] | null;
  variables: Record<string, unknown>;
  status: string;
  confirmed_at: string | null;
}

export interface ActionResult {
  action_id: string;
  tool: string;
  success: boolean;
  output: unknown;
  error: string | null;
  skipped: boolean;
  duration_ms: number;
  condition_result: boolean | null;
}

export interface AutomationExecutionLog {
  id: string;
  automation_id: string;
  user_id: string;
  started_at: string;
  completed_at: string | null;
  duration_ms: number;
  trigger_type: string;
  trigger_data: Record<string, unknown>;
  status: 'completed' | 'failed' | 'running';
  actions_executed: number;
  actions_failed: number;
  action_results: ActionResult[];
  error_summary: string | null;
  created_at: string;
}

// Legacy type kept for backwards compatibility with existing code
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
