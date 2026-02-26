import { Navigate } from "react-router-dom"
import { useAuth } from "../../components/hooks/useAuth"
import  type{ ReactNode } from "react"

type PrivateRouteProps = {
  children: ReactNode
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}