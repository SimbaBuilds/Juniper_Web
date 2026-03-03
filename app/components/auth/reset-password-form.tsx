'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/utils/supabase/client'
import { OtpInput } from '@/app/components/ui/otp-input'
import Link from 'next/link'

export function ResetPasswordForm() {
  const [step, setStep] = useState<'request' | 'verify'>('request')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    })

    if (error) {
      if (error.message.includes('rate')) {
        setError('Too many attempts. Please wait before trying again.')
      } else if (error.message.includes('not found') || error.message.includes('User not found')) {
        setError('Email not found. Please check your email or sign up.')
      } else {
        setError(error.message)
      }
      setLoading(false)
      return
    }

    setMessage('Check your email for the verification code!')
    setStep('verify')
    setResendCooldown(10)
    setLoading(false)
  }

  const handleVerifyOtp = async (code: string) => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    })

    if (error) {
      if (error.message.includes('expired')) {
        setError('Code expired. Please request a new one.')
      } else if (error.message.includes('invalid')) {
        setError('Invalid code. Please try again.')
      } else {
        setError(error.message)
      }
      setLoading(false)
      setOtp('')
      return
    }

    // User is now logged in, redirect to update password page
    router.push('/update-password')
    router.refresh()
  }

  const handleResendCode = async () => {
    setError(null)
    setMessage(null)
    setResendCooldown(10)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    })

    if (error) {
      if (error.message.includes('rate')) {
        setError('Too many attempts. Please wait before trying again.')
      } else {
        setError(error.message)
      }
    } else {
      setMessage('New code sent! Check your email.')
    }
  }

  const handleBack = () => {
    setStep('request')
    setOtp('')
    setError(null)
    setMessage(null)
  }

  if (step === 'verify') {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="space-y-6">
          <div>
            <p className="text-center text-sm text-foreground mb-6">
              We sent a 6-digit code to <span className="font-medium">{email}</span>
            </p>

            <div className="mb-4">
              <OtpInput
                value={otp}
                onChange={setOtp}
                onComplete={handleVerifyOtp}
                disabled={loading}
                error={!!error}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center mb-4">{error}</div>
            )}

            {message && (
              <div className="text-green-600 text-sm text-center mb-4">{message}</div>
            )}
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendCooldown > 0}
              className="w-full py-2 px-4 border border-border rounded-md bg-background text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0
                ? `Resend code (${resendCooldown}s)`
                : 'Resend code'}
            </button>

            <button
              type="button"
              onClick={handleBack}
              className="w-full py-2 px-4 text-sm text-primary hover:underline"
            >
              Use different email
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-foreground">
          Remember your password?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
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

        {message && (
          <div className="text-green-600 text-sm">{message}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending code...' : 'Send verification code'}
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