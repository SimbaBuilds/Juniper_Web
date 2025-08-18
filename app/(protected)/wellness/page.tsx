'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/utils/supabase/client'
import { Tags, Activity, Heart, Moon, TrendingUp, Filter, BarChart3 } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface HealthMetric {
  id: string
  user_id: string
  date: string
  sleep_score: number | null
  activity_score: number | null
  readiness_score: number | null
  stress_level: number | null
  recovery_score: number | null
  total_steps: number | null
  calories_burned: number | null
  heart_rate_avg: number | null
  hrv_avg: number | null
  created_at: string
  updated_at: string
  native_scores: any
  normalized_scores: any
}

interface ResourceWithTags {
  id: string
  title: string
  content: string
  type: string
  tags: { id: string; name: string; type: string }[]
  created_at: string
}

interface FilterPrefs {
  timeRange: string
  showResources: boolean
  showAutomations: boolean
  sortBy: string
}

const CHART_CONFIG = {
  sleep_score: {
    label: "Sleep Score",
    color: "hsl(var(--chart-1))"
  },
  activity_score: {
    label: "Activity Score", 
    color: "hsl(var(--chart-2))"
  },
  readiness_score: {
    label: "Readiness Score",
    color: "hsl(var(--chart-3))"
  },
  stress_level: {
    label: "Stress Level",
    color: "hsl(var(--chart-4))"
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function WellnessPage() {
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [healthData, setHealthData] = useState<HealthMetric[]>([])
  const [resources, setResources] = useState<ResourceWithTags[]>([])
  const [loading, setLoading] = useState(true)
  const [filterPrefs, setFilterPrefs] = useState<FilterPrefs>({
    timeRange: '30',
    showResources: true,
    showAutomations: true,
    sortBy: 'date'
  })

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wellness-filter-prefs')
    if (saved) {
      try {
        setFilterPrefs(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved preferences:', e)
      }
    }
  }, [])

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('wellness-filter-prefs', JSON.stringify(filterPrefs))
  }, [filterPrefs])

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient()
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          console.error('Error getting user:', userError)
          return
        }
        
        setUser(user)

        // Fetch health metrics data
        const daysBack = parseInt(filterPrefs.timeRange)
        const { data: metricsData, error: metricsError } = await supabase
          .from('health_metrics_daily')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .order('date', { ascending: true })
        
        if (metricsError) {
          console.error('Error fetching health metrics:', metricsError)
        } else {
          setHealthData(metricsData || [])
        }

        // Fetch resources with "Health and Wellness" tag
        const { data: resourcesData, error: resourcesError } = await supabase
          .from('resources')
          .select(`
            *,
            tag_1:tags!resources_tag_1_id_fkey(id, name, type),
            tag_2:tags!resources_tag_2_id_fkey(id, name, type),
            tag_3:tags!resources_tag_3_id_fkey(id, name, type),
            tag_4:tags!resources_tag_4_id_fkey(id, name, type),
            tag_5:tags!resources_tag_5_id_fkey(id, name, type)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (resourcesError) {
          console.error('Error fetching resources:', resourcesError)
        } else {
          // Filter resources with "Health and Wellness" tag
          const healthResources = resourcesData?.filter(resource => {
            const tags = [
              resource.tag_1,
              resource.tag_2,
              resource.tag_3,
              resource.tag_4,
              resource.tag_5
            ].filter(Boolean)
            
            return tags.some(tag => tag.name === 'Health and Wellness')
          }).map(resource => {
            const tags = [
              resource.tag_1,
              resource.tag_2,
              resource.tag_3,
              resource.tag_4,
              resource.tag_5
            ].filter(Boolean)
            
            return {
              ...resource,
              tags
            }
          }) || []
          
          setResources(healthResources)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [filterPrefs.timeRange])

  const updateFilterPref = (key: keyof FilterPrefs, value: any) => {
    setFilterPrefs(prev => ({ ...prev, [key]: value }))
  }

  // Calculate summary stats
  const summaryStats = healthData.length > 0 ? {
    avgSleepScore: Math.round(healthData.reduce((sum, d) => sum + (d.sleep_score || 0), 0) / healthData.length),
    avgActivityScore: Math.round(healthData.reduce((sum, d) => sum + (d.activity_score || 0), 0) / healthData.length),
    totalSteps: healthData.reduce((sum, d) => sum + (d.total_steps || 0), 0),
    avgReadiness: Math.round(healthData.reduce((sum, d) => sum + (d.readiness_score || 0), 0) / healthData.filter(d => d.readiness_score).length || 0)
  } : null

  // Prepare chart data
  const chartData = healthData.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sleep_score: d.sleep_score || 0,
    activity_score: d.activity_score || 0,
    readiness_score: d.readiness_score || 0,
    stress_level: d.stress_level || 0,
    steps: d.total_steps || 0,
    calories: d.calories_burned || 0
  }))

  // Activity distribution for pie chart
  const activityDistribution = healthData.length > 0 ? [
    { name: 'High Activity', value: healthData.filter(d => (d.activity_score || 0) >= 80).length },
    { name: 'Medium Activity', value: healthData.filter(d => (d.activity_score || 0) >= 50 && (d.activity_score || 0) < 80).length },
    { name: 'Low Activity', value: healthData.filter(d => (d.activity_score || 0) < 50).length }
  ].filter(item => item.value > 0) : []

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Wellness Dashboard</h1>
          <p className="text-muted-foreground">
            Track your health metrics and wellness journey.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Dashboard Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Time Range</Label>
              <Select 
                value={filterPrefs.timeRange} 
                onValueChange={(value) => updateFilterPref('timeRange', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select 
                value={filterPrefs.sortBy} 
                onValueChange={(value) => updateFilterPref('sortBy', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="sleep_score">Sleep Score</SelectItem>
                  <SelectItem value="activity_score">Activity Score</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-resources"
                checked={filterPrefs.showResources}
                onCheckedChange={(checked) => updateFilterPref('showResources', checked)}
              />
              <Label htmlFor="show-resources">Show Resources</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-automations"
                checked={filterPrefs.showAutomations}
                onCheckedChange={(checked) => updateFilterPref('showAutomations', checked)}
              />
              <Label htmlFor="show-automations">Show Automations</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {summaryStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Sleep Score</CardTitle>
              <Moon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.avgSleepScore}</div>
              <p className="text-xs text-muted-foreground">out of 100</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Activity Score</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.avgActivityScore}</div>
              <p className="text-xs text-muted-foreground">out of 100</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Steps</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.totalSteps.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">steps taken</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Readiness</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.avgReadiness}</div>
              <p className="text-xs text-muted-foreground">readiness score</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Health Scores Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Health Scores Trend</CardTitle>
              <CardDescription>Sleep, Activity, and Readiness scores over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={CHART_CONFIG} className="h-[300px]">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="sleep_score" stroke="var(--color-sleep_score)" strokeWidth={2} />
                  <Line type="monotone" dataKey="activity_score" stroke="var(--color-activity_score)" strokeWidth={2} />
                  <Line type="monotone" dataKey="readiness_score" stroke="var(--color-readiness_score)" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Activity Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Distribution</CardTitle>
              <CardDescription>Distribution of activity levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={CHART_CONFIG} className="h-[300px]">
                <PieChart>
                  <Pie
                    data={activityDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {activityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Steps and Calories */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Steps</CardTitle>
              <CardDescription>Steps taken each day</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={CHART_CONFIG} className="h-[300px]">
                <BarChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="steps" fill="hsl(var(--chart-1))" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Calories Burned */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Calories</CardTitle>
              <CardDescription>Calories burned each day</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={CHART_CONFIG} className="h-[300px]">
                <BarChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="calories" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resources Section */}
      {filterPrefs.showResources && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tags className="h-5 w-5" />
              Health & Wellness Resources
            </CardTitle>
            <CardDescription>
              Resources tagged with "Health and Wellness"
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resources.length > 0 ? (
              <div className="space-y-4">
                {resources.map((resource) => (
                  <div key={resource.id} className="bg-accent/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {resource.content.length > 200 
                        ? `${resource.content.substring(0, 200)}...`
                        : resource.content
                      }
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {resource.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No health and wellness resources found.</p>
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Tags className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <span className="font-medium">Tip:</span> Add tag "Health and Wellness" to a resource to have it appear on this screen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Automations placeholder */}
      {filterPrefs.showAutomations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Health & Wellness Automations
            </CardTitle>
            <CardDescription>
              Automated health tracking and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">No health automations configured yet.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {healthData.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">No health data found</h3>
            <p className="text-muted-foreground mb-4">
              Connect your wearable devices to start tracking your wellness metrics.
            </p>
            <Button asChild>
              <a href="/integrations">Connect Devices</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}