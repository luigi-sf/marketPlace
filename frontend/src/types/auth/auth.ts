import type { User } from '../user'
import type { ReactNode } from 'react'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User | null
  role:"CUSTOMER" | "SELLER"
}

export type Credentials = {
  email: string
  password: string
}



export interface SignupDTO {
  name: string
  email: string
  password: string
}

export type AuthProviderProps = {
  children: ReactNode
}
