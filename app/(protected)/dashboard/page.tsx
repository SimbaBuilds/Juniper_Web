import { getUser } from '@/lib/auth/get-user'

export default async function DashboardPage() {
  const user = await getUser()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.email}!</p>
      </div>

      {/* Membership Status */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-4">Membership Status</h2>
        <div className="flex items-center space-x-4">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-foreground">Active Plan</span>
          <span className="text-sm text-muted-foreground">Pro Subscription</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Plan expires:</span>
            <span className="ml-2 text-foreground">Never</span>
          </div>
          <div>
            <span className="text-muted-foreground">Usage this month:</span>
            <span className="ml-2 text-foreground">247 requests</span>
          </div>
        </div>
      </div>

      {/* Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Active Integrations</h3>
          <div className="text-3xl font-bold text-primary mb-1">12</div>
          <p className="text-sm text-muted-foreground">Connected services</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Automations</h3>
          <div className="text-3xl font-bold text-primary mb-1">8</div>
          <p className="text-sm text-muted-foreground">Active workflows</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Repository Items</h3>
          <div className="text-3xl font-bold text-primary mb-1">156</div>
          <p className="text-sm text-muted-foreground">Total saved items</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Integrations</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-foreground">Gmail</span>
              </div>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-foreground">Notion</span>
              </div>
              <span className="text-xs text-muted-foreground">1 day ago</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-foreground">Slack</span>
              </div>
              <span className="text-xs text-muted-foreground">3 days ago</span>
            </div>
          </div>
          <a href="/integrations" className="text-primary hover:underline text-sm mt-4 inline-block">
            View all integrations →
          </a>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Automations</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-foreground">Email to Notion</span>
              </div>
              <span className="text-xs text-muted-foreground">Running</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-foreground">Calendar Sync</span>
              </div>
              <span className="text-xs text-muted-foreground">Running</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-foreground">Task Reminders</span>
              </div>
              <span className="text-xs text-muted-foreground">Paused</span>
            </div>
          </div>
          <a href="/automations" className="text-primary hover:underline text-sm mt-4 inline-block">
            View all automations →
          </a>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="/integrations" className="bg-card p-6 rounded-lg border border-border hover:bg-accent transition-colors">
          <h3 className="text-lg font-semibold text-foreground mb-2">Manage Integrations</h3>
          <p className="text-sm text-muted-foreground">View and configure your connected services</p>
        </a>
        
        <a href="/automations" className="bg-card p-6 rounded-lg border border-border hover:bg-accent transition-colors">
          <h3 className="text-lg font-semibold text-foreground mb-2">View Automations</h3>
          <p className="text-sm text-muted-foreground">Check your automated workflows</p>
        </a>
        
        <a href="/repository" className="bg-card p-6 rounded-lg border border-border hover:bg-accent transition-colors">
          <h3 className="text-lg font-semibold text-foreground mb-2">Browse Repository</h3>
          <p className="text-sm text-muted-foreground">Access your saved data and files</p>
        </a>
      </div>
    </div>
  )
}