'use client'

import { useState } from 'react'
import { createClient } from '@/lib/utils/supabase/client'

interface OtpRequestFormProps {
  onSuccess: (email: string) => void
}

export function OtpRequestForm({ onSuccess }: OtpRequestFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
    })

    if (error) {
      if (error.message.includes('rate')) {
        setError('Too many attempts. Please wait before trying again.')
      } else {
        setError(error.message)
      }
      setLoading(false)
      return
    }

    onSuccess(email)
  }

  return (
    <form onSubmit={handleRequestOtp} className="space-y-4">
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
          disabled={loading}
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending code...' : 'Send verification code'}
      </button>
    </form>
  )
}
