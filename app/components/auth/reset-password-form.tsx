'use client'

import { useState } from 'react'
import { createClient } from '@/lib/utils/supabase/client'
import Link from 'next/link'

export function ResetPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const supabase = createClient()

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setMessage('Check your email for the password reset link!')
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handlePasswordReset} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="you@example.com"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        {message && (
          <div className="text-green-600 text-sm">{message}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending reset link...' : 'Send reset link'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-foreground">
        Remember your password?{' '}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}