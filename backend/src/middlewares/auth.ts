import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import { AppError } from "../error/AppError";
import { TokenPayload } from "../types/auth";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization /*pega o req do https*/

    

    if (!authHeader) {
        throw new AppError('token nao informado!', 401)
    }

    const parts = authHeader.split(' ')/*dividindo o bearer do token*/

    if (parts.length !== 2) {
        throw new AppError('token mal informado!', 401)
    }

    const [scheme, token] = parts

    if (scheme.toLowerCase() !== 'bearer') {
        throw new AppError('token mal formatado!', 401)

    }
    if (!token) {
        throw new AppError('token invalido!', 401)
    }

    const secret = process.env.JWT_SECRET

    if (!secret) {
        throw new AppError('JWT_SECRET nao configurado!', 500)
    }
    console.log("🔐 TOKEN RECEBIDO:", token)

    try {
        const decoded = Jwt.verify(token, secret) as TokenPayload
        console.log('✅ TOKEN DECODIFICADO:', decoded)

            
        req.user = decoded /*sempre saber qm e o user sem precisar ficar pegando token dnv*/
        console.log(req.user.id);
        console.log(req.user.role);

        next()
    } catch (err) {
        console.error("❌ ERRO JWT:", err);
        throw new AppError('token invalido', 401)
    }


}