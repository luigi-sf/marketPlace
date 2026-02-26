import { useState } from "react"
import type { ReactNode } from "react"
import { AuthContext } from "./authContext"
import type { User } from "../../types/user"
import type { Credentials, SignupDTO } from "../../types/auth/auth"
import { authService } from "../../services/authService"
import { tokenService } from "../../services/tokenService"

export function AuthProvider({ children }: { children: ReactNode }) {

  const [token, setToken] = useState<string | null>(() => tokenService.get())

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  })

  const [loading, setLoading] = useState(false)

  const isAuthenticated = !!token

  // 🔥 LOGIN
  async function login(credentials: Credentials): Promise<boolean> {
    setLoading(true)
    try {
      const response = await authService.login(credentials)

      tokenService.set(response.token)
      localStorage.setItem("user", JSON.stringify(response.user))

      setToken(response.token)
      setUser(response.user)

      return true
    } catch (error: unknown) {
      console.error("Erro no login:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  // 🔥 SIGNUP
  async function signup(data: SignupDTO): Promise<boolean> {
    setLoading(true)
    try {
      const response = await authService.signup(data)

      tokenService.set(response.token)
      localStorage.setItem("user", JSON.stringify(response.user))

      setToken(response.token)
      setUser(response.user)

      return true
    } catch (error: unknown) {
      console.error("Erro no signup:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  // 🔥 LOGOUT
  function logout() {
    setUser(null)
    setToken(null)

    tokenService.remove()
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}