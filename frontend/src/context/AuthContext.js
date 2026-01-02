"use client"

import { createContext, useState, useContext, useEffect } from "react"
import api from "../config/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await api.get("/api/auth/me")
      setUser(response.data.user)
    } catch (error) {
      console.error("Failed to fetch user:", error)
      localStorage.removeItem("token")
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await api.post("/api/auth/login", { email, password })
    const { token, user } = response.data
    localStorage.setItem("token", token)
    setUser(user)
    return response.data
  }

  const register = async (name, email, password, role) => {
    const response = await api.post("/api/auth/register", { name, email, password, role })
    const { token, user } = response.data
    localStorage.setItem("token", token)
    setUser(user)
    return response.data
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
