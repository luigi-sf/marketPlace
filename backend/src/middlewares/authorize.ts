import { Request,Response,NextFunction} from 'express'
import { AppError } from '../error/AppError'
import { Role } from '../../generated/prisma/client'

export function authorize(...roles:Role[]){ /*dx filtrar as permissoes*/
    return(req:Request,res:Response,next:NextFunction) => {
        const user = req.user


        if (!user)
            throw new AppError('nao autenticado',404)


        if(!roles.includes(user.role)) 
            throw new AppError('sem permissao',403)
            
     next()   
    }
}