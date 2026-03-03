import { Role } from "@prisma/client";

export type TokenPayload = {
    id: string;
    role: Role;
    sellerProfileID?:string;
    iat?: number;
    exp?: number;
}
