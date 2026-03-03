'use client'

import { useState } from 'react'
import { LoginForm } from '@/app/components/auth/login-form'
import { OtpRequestForm } from './otp-request-form'
import { OtpVerifyForm } from './otp-verify-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function LoginPage() {
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request')
  const [otpEmail, setOtpEmail] = useState('')

  const handleOtpSuccess = (email: string) => {
    setOtpEmail(email)
    setOtpStep('verify')
  }

  const handleOtpBack = () => {
    setOtpStep('request')
    setOtpEmail('')
  }

  return (
    <div>
      <h2 className="text-center text-3xl font-bold text-foreground mb-8">
        Sign in to your account
      </h2>

      <div className="w-full max-w-md mx-auto">
        <Tabs defaultValue="password" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="code">Email Code</TabsTrigger>
          </TabsList>

          <TabsContent value="password">
            <LoginForm />
          </TabsContent>

          <TabsContent value="code">
            {otpStep === 'request' ? (
              <OtpRequestForm onSuccess={handleOtpSuccess} />
            ) : (
              <OtpVerifyForm email={otpEmail} onBack={handleOtpBack} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}