'use client'

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { cn } from '@/lib/utils'

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  disabled?: boolean
  error?: boolean
  length?: number
}

export function OtpInput({
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  length = 6,
}: OtpInputProps) {
  const handleChange = (newValue: string) => {
    onChange(newValue)
    if (newValue.length === length && onComplete) {
      onComplete(newValue)
    }
  }

  return (
    <InputOTP
      maxLength={length}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      containerClassName="justify-center"
    >
      <InputOTPGroup>
        {Array.from({ length }).map((_, index) => (
          <InputOTPSlot
            key={index}
            index={index}
            className={cn(
              error && 'border-destructive ring-destructive/20 dark:ring-destructive/40'
            )}
            aria-invalid={error}
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  )
}
