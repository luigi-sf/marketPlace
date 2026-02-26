import type { SignupDTO,Credentials } from "./auth"
import type { User } from "../user"

export type AuthContextData = {
   user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (credentials: Credentials) => Promise<boolean>
  signup: (data: SignupDTO) => Promise<boolean>
  logout: () => void
}
