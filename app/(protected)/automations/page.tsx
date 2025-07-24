// import { getUser } from '@/lib/auth/get-user'
import { Automation, HotPhrase } from '@/app/lib/automations/types'

// Mock data - in real app this would come from API
const mockAutomations: Automation[] = [
  {
    id: '1',
    user_id: 'user1',
    name: 'Email to Notion Workflow',
    trigger_conditions: { type: 'email_received', from: 'important@example.com' },
    actions: { type: 'create_notion_page', database: 'inbox' },
    is_active: true,
    execution_count: 47,
    last_executed: new Date('2024-01-20T10:30:00Z'),
    notes: 'Automatically creates Notion pages from important emails',
    created_at: new Date('2024-01-01T00:00:00Z'),
    integrations: ['Gmail', 'Notion']
  },
  {
    id: '2',
    user_id: 'user1',
    name: 'Calendar Event Sync',
    trigger_conditions: { type: 'calendar_event_created' },
    actions: { type: 'send_slack_notification', channel: '#general' },
    is_active: true,
    execution_count: 23,
    last_executed: new Date('2024-01-19T14:15:00Z'),
    created_at: new Date('2024-01-05T00:00:00Z'),
    integrations: ['Google Calendar', 'Slack']
  },
  {
    id: '3',
    user_id: 'user1',
    name: 'Weekly Task Summary',
    trigger_conditions: { type: 'schedule', cron: '0 9 * * 1' },
    actions: { type: 'generate_summary', source: 'todoist' },
    is_active: false,
    execution_count: 8,
    last_executed: new Date('2024-01-15T09:00:00Z'),
    created_at: new Date('2024-01-10T00:00:00Z'),
    integrations: ['Todoist', 'Gmail']
  }
];

const mockHotPhrases: HotPhrase[] = [
  {
    id: '1',
    user_id: 'user1',
    phrase: 'send a text',
    service_name: 'Textbelt',
    tool_name: 'send_sms',
    description: 'Send SMS messages quickly',
    is_built_in: true,
    is_active: true,
    execution_count: 156,
    last_used: new Date('2024-01-20T08:45:00Z'),
    created_at: new Date('2024-01-01T00:00:00Z'),
    updated_at: new Date('2024-01-01T00:00:00Z')
  },
  {
    id: '2',
    user_id: 'user1',
    phrase: 'create meeting note',
    service_name: 'Notion',
    tool_name: 'create_page',
    description: 'Quickly create meeting notes in Notion',
    is_built_in: false,
    is_active: true,
    execution_count: 34,
    last_used: new Date('2024-01-19T16:30:00Z'),
    created_at: new Date('2024-01-08T00:00:00Z'),
    updated_at: new Date('2024-01-08T00:00:00Z')
  },
  {
    id: '3',
    user_id: 'user1',
    phrase: 'schedule reminder',
    service_name: 'Google Calendar',
    tool_name: 'create_event',
    description: 'Set calendar reminders',
    is_built_in: false,
    is_active: false,
    execution_count: 12,
    last_used: new Date('2024-01-10T11:15:00Z'),
    created_at: new Date('2024-01-03T00:00:00Z'),
    updated_at: new Date('2024-01-15T00:00:00Z')
  }
];

function formatLastExecuted(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffHours < 24) {
    return `${Math.floor(diffHours)} hours ago`;
  } else if (diffDays < 7) {
    return `${Math.floor(diffDays)} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

export default async function AutomationsPage() {
  // const user = await getUser() // Currently using mock data
  
  const activeAutomations = mockAutomations.filter(a => a.is_active);
  const inactiveAutomations = mockAutomations.filter(a => !a.is_active);
  const activeHotPhrases = mockHotPhrases.filter(h => h.is_active);
  const inactiveHotPhrases = mockHotPhrases.filter(h => !h.is_active);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Automations</h1>
        <p className="text-muted-foreground">
          View your automated workflows and quick action phrases. Manage automations through the mobile app.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Active Automations</h3>
          <div className="text-3xl font-bold text-green-600 mb-1">{activeAutomations.length}</div>
          <p className="text-sm text-muted-foreground">Running workflows</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Total Executions</h3>
          <div className="text-3xl font-bold text-primary mb-1">
            {mockAutomations.reduce((sum, a) => sum + a.execution_count, 0)}
          </div>
          <p className="text-sm text-muted-foreground">All time</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Hot Phrases</h3>
          <div className="text-3xl font-bold text-blue-600 mb-1">{activeHotPhrases.length}</div>
          <p className="text-sm text-muted-foreground">Quick actions</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Phrase Usage</h3>
          <div className="text-3xl font-bold text-primary mb-1">
            {mockHotPhrases.reduce((sum, h) => sum + h.execution_count, 0)}
          </div>
          <p className="text-sm text-muted-foreground">Total uses</p>
        </div>
      </div>

      {/* Event-Driven Automations */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Event-Driven Automations</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Ask your assistant to create automations that respond to specific triggers and conditions.
          </p>
        </div>

        {activeAutomations.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Active Automations ({activeAutomations.length})</h3>
            <div className="grid grid-cols-1 gap-4">
              {activeAutomations.map((automation) => (
                <div key={automation.id} className="bg-card p-6 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-foreground">{automation.name}</h3>
                    </div>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-200">
                      Active
                    </span>
                  </div>
                  
                  {automation.notes && (
                    <p className="text-sm text-muted-foreground mb-4">{automation.notes}</p>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-muted-foreground">Executions:</span>
                      <span className="ml-2 font-medium text-foreground">{automation.execution_count}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last run:</span>
                      <span className="ml-2 text-foreground">
                        {automation.last_executed ? formatLastExecuted(automation.last_executed) : 'Never'}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Integrations:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {automation.integrations.map((integration) => (
                          <span key={integration} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-200">
                            {integration}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground text-center">
                      Read-only view • Manage through mobile app
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {inactiveAutomations.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Inactive Automations ({inactiveAutomations.length})</h3>
            <div className="grid grid-cols-1 gap-4">
              {inactiveAutomations.map((automation) => (
                <div key={automation.id} className="bg-card p-6 rounded-lg border border-border opacity-60">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-foreground">{automation.name}</h3>
                    </div>
                    <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-full dark:bg-gray-800 dark:text-gray-200">
                      Inactive
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Executions:</span>
                      <span className="ml-2 font-medium text-foreground">{automation.execution_count}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last run:</span>
                      <span className="ml-2 text-foreground">
                        {automation.last_executed ? formatLastExecuted(automation.last_executed) : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mockAutomations.length === 0 && (
          <div className="bg-card p-8 rounded-lg border border-border text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">No automations yet</h3>
            <p className="text-muted-foreground mb-4">
              Ask your assistant to create automations that can respond to triggers like email, calendar events, or schedules.
            </p>
            <p className="text-sm text-muted-foreground">
              Example: &quot;Create an automation that sends me a Slack message when I get an important email&quot;
            </p>
          </div>
        )}
      </div>

      {/* Hot Phrases Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Hot Phrases</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Quick action phrases for frequent tasks. Create custom phrases through the mobile app.
          </p>
        </div>

        {activeHotPhrases.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Active Phrases ({activeHotPhrases.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeHotPhrases.map((phrase) => (
                <div key={phrase.id} className="bg-card p-6 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <h3 className="font-semibold text-foreground">&quot;{phrase.phrase}&quot;</h3>
                    </div>
                    <div className="flex space-x-2">
                      {phrase.is_built_in && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                          Built-in
                        </span>
                      )}
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-200">
                        Active
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{phrase.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-muted-foreground">Service:</span>
                      <span className="ml-2 font-medium text-foreground">{phrase.service_name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Uses:</span>
                      <span className="ml-2 font-medium text-foreground">{phrase.execution_count}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Last used:</span>
                      <span className="ml-2 text-foreground">
                        {phrase.last_used ? formatLastExecuted(phrase.last_used) : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {inactiveHotPhrases.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Inactive Phrases ({inactiveHotPhrases.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inactiveHotPhrases.map((phrase) => (
                <div key={phrase.id} className="bg-card p-6 rounded-lg border border-border opacity-60">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <h3 className="font-semibold text-foreground">&quot;{phrase.phrase}&quot;</h3>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full dark:bg-gray-800 dark:text-gray-200">
                      Inactive
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-muted-foreground">Uses:</span>
                    <span className="ml-2 font-medium text-foreground">{phrase.execution_count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}