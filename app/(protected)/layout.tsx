import { getUser } from '@/lib/auth/get-user'
import { MobileMenu } from '@/app/components/mobile-menu'
import { Sidebar } from '@/app/components/sidebar'
import Link from 'next/link'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  const userEmail = user.email || ''

  return (
    <div className="min-h-screen bg-background md:flex">
      <aside className="hidden md:flex md:w-60 md:flex-shrink-0 md:fixed md:inset-y-0 md:left-0 md:z-30">
        <Sidebar userEmail={userEmail} />
      </aside>

      <header className="md:hidden sticky top-0 z-20 flex items-center justify-between bg-card border-b border-border px-4 h-14">
        <MobileMenu userEmail={userEmail} />
        <Link
          href="/"
          className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
        >
          Juniper
        </Link>
        <div className="w-9" />
      </header>

      <main className="flex-1 md:ml-60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
