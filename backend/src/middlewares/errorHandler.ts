import { AppError } from "../error/AppError";
import { Request, Response,NextFunction } from "express";

export function errorHandler(err:Error,req:Request,res:Response,next:NextFunction){
    if (err instanceof AppError)/*confirmando se e instancia pra nao pegar erro n configurado*/{
        return res.status(err.statusCode).json({
            message:err.message,
        })
    }
    return res.status(500).json({
        message: 'Erro interno do servidor'
    })
}