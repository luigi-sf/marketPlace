import { Response } from "express";

export function success<T>(
    res:Response,
    data:T, /* msm coisa q any/uknow*/
    message = 'Success',
    statusCode = 200
){
    return res.status(statusCode).json({
        status:'success',
        message,
        data
    })
}