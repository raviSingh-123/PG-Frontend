import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authApi from '../api/authApi'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('pg_admin')
    return raw ? JSON.parse(raw) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('pg_token') || null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (token && !user) {
      // optionally fetch admin profile here
    }
  }, [token, user])

  const login = async (credentials) => {
    setLoading(true)
    try {
      const res = await authApi.adminLogin(credentials)
      const { token: tkn, user: admin } = res.data
      localStorage.setItem('pg_token', tkn)
      localStorage.setItem('pg_admin', JSON.stringify(admin))
      setToken(tkn)
      setUser(admin)
      setLoading(false)
      return { ok: true }
    } catch (err) {
      setLoading(false)
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('pg_token')
    localStorage.removeItem('pg_admin')
    setToken(null)
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export default AuthContext
