'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, Shield } from 'lucide-react'
import Link from 'next/link'
import Script from 'next/script'

declare global {
  interface Window {
    grecaptcha: any
  }
}

interface ContactFormProps {
  variant?: 'support' | 'business'
  className?: string
}

export function ContactForm({ variant = 'support', className = '' }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'message' && value.length > 1000) return
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')
    
    try {
      let recaptchaToken = null
      
      if (recaptchaLoaded && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        try {
          recaptchaToken = await window.grecaptcha.execute(
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
            { action: 'contact_form' }
          )
        } catch (recaptchaError) {
          console.warn('reCAPTCHA failed, proceeding without it:', recaptchaError)
        }
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send message')
      }

      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => {
        setSubmitStatus('idle')
        setErrorMessage('')
      }, 5000)
    }
  }

  const isBusinessVariant = variant === 'business'
  const title = isBusinessVariant ? 'Get in Touch' : 'Contact Support'
  const description = isBusinessVariant 
    ? "Let's discuss how we can build custom AI solutions for your business needs."
    : "Get personalized support for Juniper from the HightowerAI team. We'll get back to you as soon as possible."

  return (
    <>
      {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          onLoad={() => setRecaptchaLoaded(true)}
        />
      )}
      <Card className={`border-0 shadow-lg bg-background ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <p className="text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                Name *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">
              Subject *
            </label>
            <Input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder={isBusinessVariant ? "What can we help you build?" : "Brief description of your issue"}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
              Message * <span className="text-xs text-gray-500">({formData.message.length}/1000)</span>
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder={isBusinessVariant 
                ? "Tell us about your project, goals, and how we can help transform your business with AI..."
                : "Please provide detailed information about your issue or question..."}
              className="min-h-32"
              maxLength={1000}
            />
          </div>

          {submitStatus === 'success' && (
            <div className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-md p-3">
              ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3">
              ✗ {errorMessage || 'There was an error sending your message. Please try again.'}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button>

          <div className="text-xs text-gray-500 text-center mt-4">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Shield className="h-3 w-3" />
              <span>Your information is secure and will only be used to respond to your inquiry.</span>
            </div>
            <p>
              By submitting this form, you agree to our{' '}
              <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              . Juniper by HightowerAI.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
    </>
  )
}