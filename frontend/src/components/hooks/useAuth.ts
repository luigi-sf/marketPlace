import { useContext } from 'react'
import { AuthContext } from '../../contexts/auth/authContext'

export function useAuth() {
  return useContext(AuthContext)
}