import { TokenPayload } from '../types/auth';
import 'express';
import { Role } from '@prisma/client';

declare module 'express' {
  export interface Request {
    user?: TokenPayload;
  }
}



declare global{
  namespace Express{
    interface Request{
      user?:{
        id:string
        role:Role
        sellerProfileId?:string
      }
    }
  }
}