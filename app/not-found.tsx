'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Brain, Home, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [isOAuthCallback, setIsOAuthCallback] = useState(false)
  const [serviceName, setServiceName] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname
      const search = window.location.search
      
      // Check if this is an OAuth callback URL
      const oauthCallbackPattern = /^\/oauth\/([^\/]+)\/callback/
      const match = path.match(oauthCallbackPattern)
      
      if (match && search.includes('code=')) {
        setIsOAuthCallback(true)
        setServiceName(match[1])
      }
    }
  }, [])

  if (isOAuthCallback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center space-y-8 max-w-md mx-auto px-4">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-green-900">Authentication Failed</h1>
            <p className="text-green-700">
              Authentication for this service may be temporarily unavailable.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-6 rounded-lg text-left space-y-4">
            <h3 className="font-semibold text-blue-900">To avoid this page in the future (Android only):</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Navigate to the app settings</li>
              <li>Go to "Open by Default"</li>
              <li>Select the Juniper URL</li>
            </ol>
            <p className="text-sm text-blue-700 mt-4">
              Once authentication is completed, we recommend asking your assistant to complete the integration for this service since it was interrupted.
            </p>
          </div>

          {/* Actions
          <div className="flex flex-col gap-4 justify-center">
            <Link href="/integrations">
              <Button className="flex items-center space-x-2 w-full">
                <Search className="h-4 w-4" />
                <span>Go to Integrations</span>
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" className="flex items-center space-x-2 w-full">
                <Home className="h-4 w-4" />
                <span>Go to Chat</span>
              </Button>
            </Link>
          </div> */}

          {/* Brand */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              © 2025 Juniper.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md mx-auto px-4">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Brain className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
          <p className="text-gray-600">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Go Home</span>
            </Button>
          </Link>
          <Link href="/integrations">
            <Button variant="outline" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Browse Integrations</span>
            </Button>
          </Link>
        </div>

        {/* Brand */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            © 2025 Juniper.
          </p>
        </div>
      </div>
    </div>
  )
} 