import api from "./api";
import type { LoginRequest,LoginResponse,SignupDTO } from "../types/auth/auth";

export const authService = {
    async login(data: LoginRequest): Promise<LoginResponse>{
        const {data:response} = await api.post('/auth/login',data)

        return response.data
    },
    async signup(data:SignupDTO):Promise<LoginResponse>{
        const {data:response} = await api.post('/auth/register',data)
        return response.data
    }
}