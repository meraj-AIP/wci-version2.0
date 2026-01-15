import { createContext, useContext, useState, useLayoutEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, default to dark if not set
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aries-theme')
      return saved ? saved === 'dark' : true
    }
    return true // Default to dark
  })

  // Use useLayoutEffect to apply theme synchronously before paint
  useLayoutEffect(() => {
    const root = document.documentElement
    // Remove both classes first to ensure clean state
    root.classList.remove('dark', 'light')
    // Add the appropriate class
    root.classList.add(isDark ? 'dark' : 'light')
    // Also set a data attribute as fallback
    root.setAttribute('data-theme', isDark ? 'dark' : 'light')
    // Save to localStorage
    localStorage.setItem('aries-theme', isDark ? 'dark' : 'light')

    // Debug log
    console.log('Theme changed:', isDark ? 'dark' : 'light', 'Classes:', root.classList.toString())
  }, [isDark])

  const toggleTheme = () => setIsDark(prev => !prev)

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
