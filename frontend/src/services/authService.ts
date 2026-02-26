import api from "./api";
import type { LoginRequest,LoginResponse,SignupDTO } from "../types/auth/auth";

export const authService = {
    async login(data: LoginRequest): Promise<LoginResponse>{
        const response = await api.post('/auth/login',data)

        return response.data.data
    },
    async signup(data:SignupDTO):Promise<LoginResponse>{
        const response = await api.post('/auth/register',data)
        return response.data.data
    }
}