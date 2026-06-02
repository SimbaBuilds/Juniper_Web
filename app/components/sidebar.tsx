'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Plug,
  Workflow,
  MessageSquare,
  Bell,
  HeartPulse,
  FolderClosed,
  UserCircle,
} from 'lucide-react'
import { ThemeToggle } from '@/app/components/theme-toggle'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/integrations', label: 'Integrations', icon: Plug },
  { href: '/automations', label: 'Automations', icon: Workflow },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/wellness', label: 'Wellness', icon: HeartPulse },
  { href: '/repository', label: 'Repository', icon: FolderClosed },
  { href: '/account', label: 'Account', icon: UserCircle },
] as const

interface SidebarProps {
  userEmail: string
  onNavigate?: () => void
}

export function Sidebar({ userEmail, onNavigate }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-card border-r border-border">
      <div className="px-6 py-5 border-b border-border">
        <Link
          href="/"
          onClick={onNavigate}
          className="text-xl font-semibold text-foreground hover:text-primary transition-colors"
        >
          Juniper
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname?.startsWith(href + '/')
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-foreground font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span>{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-border px-4 py-3 space-y-3">
        <div className="flex items-center justify-between">
          <span
            className="text-xs text-muted-foreground truncate"
            title={userEmail}
          >
            {userEmail}
          </span>
          <ThemeToggle />
        </div>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
