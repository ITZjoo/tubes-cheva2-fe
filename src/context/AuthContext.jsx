import { createContext, useContext, useEffect, useState } from 'react'
import { getStoredToken, setStoredToken } from '../services/api'
import * as authService from '../modules/auth/services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(getStoredToken())
  const [loading, setLoading] = useState(Boolean(getStoredToken()))

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    authService
      .getProfile()
      .then(setUser)
      .catch(() => {
        setStoredToken(null)
        setToken(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
    // Only re-hydrate when the token itself changes (login/logout), not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const login = (userData, authToken) => {
    setStoredToken(authToken)
    setUser(userData)
    setToken(authToken)
  }

  const logout = () => {
    setStoredToken(null)
    setUser(null)
    setToken(null)
  }

  const updateUser = (patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
