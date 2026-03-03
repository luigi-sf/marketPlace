import { Navigate } from "react-router-dom"
import { useAuth } from "../../components/hooks/useAuth"
import type { PrivateRouteProps } from "../../types/auth/auth"


export function PrivateRoute({ children }: PrivateRouteProps) {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}