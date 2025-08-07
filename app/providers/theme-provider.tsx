'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { themes, type ThemeName, getCSSVariables } from '@/lib/themes'

type Mode = 'dark' | 'light'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultMode?: Mode
}

type ThemeProviderState = {
  mode: Mode
  setMode: (mode: Mode) => void
  toggleMode: () => void
  mounted: boolean
}

const initialState: ThemeProviderState = {
  mode: 'light',
  setMode: () => null,
  toggleMode: () => null,
  mounted: false,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultMode = 'light',
  ...props
}: ThemeProviderProps) {
  const [mode, setMode] = useState<Mode>(defaultMode)
  const [mounted, setMounted] = useState(false)
  const theme: ThemeName = 'vintage' // Fixed theme

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark')
    Object.keys(themes).forEach(themeName => {
      root.classList.remove(themeName)
    })
    
    // Add current mode and vintage theme classes
    root.classList.add(mode)
    root.classList.add('vintage')
    
    // Apply CSS variables
    const cssVariables = getCSSVariables(theme, mode)
    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }, [theme, mode, mounted])

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light')
  }

  const value = {
    mode,
    setMode,
    toggleMode,
    mounted,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}