import { prisma } from '../lib/prisma'
import { CreateUserDTO, UpdateUserDTO } from '../types/user'
import bcrypt from 'bcrypt'
import { AppError } from '../error/AppError'


export class UserService {
    async create(dto: CreateUserDTO) {
        const hash = await bcrypt.hash(dto.password, 10) /*criptografar o password*/


        /*criar o user */
        return prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: hash,
                role: dto.role || 'CUSTOMER'
            }
        })
    }
    /*lista o user pegando informacoes do prisma*/
    async list() {
        return prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        })
    }


    /*buscando o user pelo id*/
    async findById(id: string) {
        const user = await prisma.user.findUnique({
            where: { id }
        })
        if (!user) {
            throw new AppError('user nao encontrado', 404)
        }
        return user
    }


    /*fazendo o update pelo id*/
    async update(id: string, data: UpdateUserDTO) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        return prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
            }
        })
    }

    /*deletando pelo id*/
    async delete(id: string) {
        try {
            return prisma.user.delete({
                where: { id }
            })
        } catch (err) {
            return new AppError('usuario nao encontrado!', 404)
        }

    }
}


