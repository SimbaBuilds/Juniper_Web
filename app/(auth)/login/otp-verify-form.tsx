'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/utils/supabase/client'
import { OtpInput } from '@/app/components/ui/otp-input'

interface OtpVerifyFormProps {
  email: string
  onBack: () => void
}

export function OtpVerifyForm({ email, onBack }: OtpVerifyFormProps) {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

    router.push('/dashboard')
    router.refresh()
  }

  const handleResendCode = async () => {
    setError(null)
    setResendCooldown(10)

    const { error } = await supabase.auth.signInWithOtp({
      email,
    })

    if (error) {
      if (error.message.includes('rate')) {
        setError('Too many attempts. Please wait before trying again.')
      } else {
        setError(error.message)
      }
    }
  }

  return (
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
          onClick={onBack}
          className="w-full py-2 px-4 text-sm text-primary hover:underline"
        >
          Use different email
        </button>
      </div>
    </div>
  )
}
