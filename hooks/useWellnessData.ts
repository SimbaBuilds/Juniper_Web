import { useState, useEffect } from 'react'
import { createClient } from '@/lib/utils/supabase/client'

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

export function useWellnessData(timeRangeDays: number = 30) {
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [healthData, setHealthData] = useState<HealthMetric[]>([])
  const [resources, setResources] = useState<ResourceWithTags[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)
        const supabase = createClient()
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          throw new Error('Authentication required')
        }
        
        setUser(user)

        // Fetch health metrics data
        const cutoffDate = new Date(Date.now() - timeRangeDays * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0]
          
        const { data: metricsData, error: metricsError } = await supabase
          .from('health_metrics_daily')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', cutoffDate)
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
        console.error('Error loading wellness data:', error)
        setError(error instanceof Error ? error.message : 'Failed to load wellness data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [timeRangeDays])

  // Aggregate health aggregation function
  const aggregateHealthData = async () => {
    try {
      const response = await fetch('/api/health-aggregation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          days: 3  // Default to 3 days for real-time updates
        })
      })

      const result = await response.json()

      if (response.ok) {
        console.log(`✅ Aggregated ${result.days_processed} days in ${result.latency_ms}ms`)
        // Reload data after aggregation
        const cutoffDate = new Date(Date.now() - timeRangeDays * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0]
        
        const supabase = createClient()
        const { data: metricsData } = await supabase
          .from('health_metrics_daily')
          .select('*')
          .eq('user_id', user?.id)
          .gte('date', cutoffDate)
          .order('date', { ascending: true })
        
        if (metricsData) {
          setHealthData(metricsData)
        }
      }
    } catch (error) {
      console.error('Health aggregation failed:', error)
    }
  }

  return {
    user,
    healthData,
    resources,
    loading,
    error,
    aggregateHealthData
  }
}