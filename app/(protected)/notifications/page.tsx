'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, BellOff, ChevronDown, ChevronUp, MessageSquare, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { createClient } from '@/lib/utils/supabase/client'
import { saveChatState } from '@/lib/utils/chatPersistence'

export interface PushNotification {
  id: string
  user_id: string
  title: string | null
  body: string | null
  data: Record<string, unknown> | null
  priority: string
  sound: string
  badge: number | null
  source_type: 'automation' | 'agent' | 'manual' | null
  source_id: string | null
  total_devices: number
  success_count: number
  failure_count: number
  delivery_results: unknown[] | null
  is_read: boolean
  read_at: string | null
  opened_at: string | null
  dismissed_at: string | null
  created_at: string
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<PushNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [userId, setUserId] = useState<string | null>(null)

  const fetchNotifications = useCallback(async (uid: string) => {
    const supabase = createClient()
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 10)
    const { data, error } = await supabase
      .from('push_notifications')
      .select('*')
      .eq('user_id', uid)
      .gte('created_at', cutoff.toISOString())
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) {
      console.error('[NOTIFICATIONS] Error fetching:', error)
      toast.error('Failed to load notifications')
      return
    }
    setNotifications((data || []) as PushNotification[])
  }, [])

  const markAllAsRead = useCallback(async (uid: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('push_notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', uid)
      .eq('is_read', false)
    if (error) console.error('[NOTIFICATIONS] Error marking read:', error)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || cancelled) {
        setIsLoading(false)
        return
      }
      setUserId(user.id)
      await fetchNotifications(user.id)
      await markAllAsRead(user.id)
      if (!cancelled) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, is_read: true, read_at: n.read_at || new Date().toISOString() })),
        )
        setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [fetchNotifications, markAllAsRead])

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleRefresh = async () => {
    if (!userId) return
    setIsLoading(true)
    await fetchNotifications(userId)
    setIsLoading(false)
  }

  const handleChatPress = (n: PushNotification) => {
    const content = `Juniper sent this notification:\n\n**${n.title || 'Notification'}**\n${n.body || ''}`
    saveChatState({
      messages: [{ role: 'assistant', content, timestamp: Date.now() }],
      conversationId: null,
      currentRequestId: null,
      loadingStartTime: null,
    })
    router.push('/chat')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
        </Button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {isLoading && notifications.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <BellOff className="h-12 w-12 text-muted-foreground mb-3" />
            <h2 className="text-lg font-semibold mb-1">No notifications</h2>
            <p className="text-sm text-muted-foreground">
              You&apos;re all caught up! New notifications will appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {notifications.map((n) => {
              const isExpanded = expandedIds.has(n.id)
              return (
                <li
                  key={n.id}
                  className={`px-4 py-3 ${!n.is_read ? 'bg-primary/5' : ''}`}
                  data-testid="notification-item"
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => toggleExpanded(n.id)}
                      className="flex-1 text-left min-w-0"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold text-foreground ${
                            isExpanded ? '' : 'truncate block'
                          }`}
                        >
                          {n.title || 'Notification'}
                        </span>
                      </div>
                      {n.body && (
                        <p
                          className={`text-sm text-muted-foreground mt-1 ${
                            isExpanded ? '' : 'line-clamp-2'
                          }`}
                        >
                          {n.body}
                        </p>
                      )}
                      {n.source_type && (
                        <Badge variant="secondary" className="mt-2 text-[10px] uppercase">
                          {n.source_type}
                        </Badge>
                      )}
                    </button>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatRelativeTime(n.created_at)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleChatPress(n)}
                        title="Start chat about this notification"
                        data-testid="notification-chat-button"
                      >
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleExpanded(n.id)}
                        title={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
