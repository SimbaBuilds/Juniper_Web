"use client"

import { Menu, Brain } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface PublicMobileMenuProps {
  user?: { email?: string } | null
  loading?: boolean
  signOut?: () => void
}

export function PublicMobileMenu({ user, loading, signOut }: PublicMobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6" style={{color: 'var(--muted-blue)'}} />
            <SheetTitle>Juniper</SheetTitle>
          </div>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {loading ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : user ? (
            <>
              <p className="text-sm text-muted-foreground border-b border-border pb-4">{user.email || 'User'}</p>
              <SheetClose asChild>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">Dashboard</Button>
                </Link>
              </SheetClose>
              <Button variant="ghost" onClick={signOut} className="w-full">
                Sign out
              </Button>
            </>
          ) : (
            <>
              <SheetClose asChild>
                <Link href="/login">
                  <Button variant="ghost" className="w-full">Sign in</Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/signup">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </SheetClose>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}