import { useState } from "react"
import { useAuth } from "../../components/hooks/useAuth"
import { useNavigate, Link } from "react-router-dom"
import "../../assets/styles/login.scss"

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Preencha todos os campos.")
      return
    }

    try {
      const success = await login({ email, password })

      if (success) {
        navigate("/dashboard")
      } else {
        setError("Email ou senha inválidos.")
      }
    } catch {
      setError("Erro inesperado. Tente novamente.")
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-header">
          <h1>OmniMarket</h1>
          <p>Acesse sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="auth-footer">
            Não tem conta?
            <Link to="/register"> Criar conta</Link>
          </div>
        </form>
      </div>
    </div>
  )
}