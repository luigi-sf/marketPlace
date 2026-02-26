import { useState } from "react"
import { useAuth } from "../../components/hooks/useAuth"
import { useNavigate, Link } from "react-router-dom"
import "../../assets/styles/signup.scss"

export default function RegisterPage() {
  const { signup, loading } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    if (!name || !email || !password) {
      setError("Preencha todos os campos.")
      return
    }

    try {
      const success = await signup({ name, email, password })

      if (success) {
        navigate("/dashboard")
      } else {
        setError("Erro ao criar conta.")
      }
    } catch {
      setError("Erro inesperado. Tente novamente.")
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">

        <div className="register-header">
          <h1>OmniMarket</h1>
          <p>Crie sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">

          <div className="input-group">
            <label>Nome</label>
            <input
              type="text"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              autoComplete="new-password"
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>

          <div className="auth-footer">
            Já tem conta?
            <Link to="/login"> Entrar</Link>
          </div>

        </form>
      </div>
    </div>
  )
}