import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getStoredUser())
  const [token, setToken] = useState(() => authService.getToken())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Keep state in sync if another tab logs out
    function handleStorage(e) {
      if (e.key === 'splitsettle_token' && !e.newValue) {
        setUser(null)
        setToken(null)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const login = useCallback(async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authService.login(credentials)
      const nextToken = data.token || data.accessToken
      const nextUser = data.user || {
        id: data.userId,
        name: data.fullName || data.name,
        email: data.email || credentials.email,
        role: data.role,
      }
      authService.saveSession(nextToken, nextUser)
      setToken(nextToken)
      setUser(nextUser)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Check your credentials and try again.'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authService.register(payload)
      // Some backends auto-login on register (return a token), others don't.
      if (data.token || data.accessToken) {
        const nextToken = data.token || data.accessToken
        const nextUser = data.user || {
          id: data.userId,
          name: data.fullName || payload.fullName || payload.name,
          email: data.email || payload.email,
          role: data.role,
        }
        authService.saveSession(nextToken, nextUser)
        setToken(nextToken)
        setUser(nextUser)
      }
      return { success: true, autoLoggedIn: Boolean(data.token || data.accessToken) }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    setToken(null)
  }, [])

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    loading,
    error,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

export default AuthContext
