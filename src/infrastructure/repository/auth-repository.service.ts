import { ConflictException, Injectable, NotFoundException, UploadedFile } from "@nestjs/common";
import { PrismaService } from "src/database/dataBase.service";
import { SafeUser, userSelect, userSelectWithPassword, UserWithPassword } from '../../types/prisma-user'
import { Prisma } from "@prisma/client";
import { IAuthRepository } from "../../interfaces/repository/auth-repository";
import { User } from "src/core/entities/user.entity";
import { User as PrismaUser } from "@prisma/client";
@Injectable()
export class AuthRepository implements IAuthRepository{
    private readonly select = userSelect;
    private readonly selectWithPassword = userSelectWithPassword;

    constructor(private readonly prisma: PrismaService){};

    async create(user: User): Promise<User>{
        try {

            const userCreated = await this.prisma.user.create({
                data: { 
                    email: user.userEmail.getValue(),
                    username: user.userFirstName.getValue(),
                    lastname: user.userLastName.getValue(),
                    password: user.userPasswordHash, 
                    role: user.userRole, 
                    refreshToken:'', 
                    revoked: true },  select: this.select
                })

            return User.formData(userCreated)
                    
        } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 — это код Prisma для Unique constraint failed
            if (e.code === 'P2002') {
                throw new ConflictException('Email already exists'); 
            }
        }
        throw e; 
}}
    async findById(id: string, withPassword?: boolean): Promise<User | null> {

        const findUser =  await this.prisma.user.findUnique({
            where: { id }, select: withPassword ? this.selectWithPassword : this.select
        });
 
        if(!findUser) return null;

        return User.formData(findUser)

}
    async findByEmail(email: string, withPassword?: boolean): Promise<User | null>{
        const findUser = await this.prisma.user.findUnique(({
            where:{
                email: email
            }, select: withPassword ? this.selectWithPassword : this.select
        }))

        if(!findUser) return null;

        return User.formData(findUser)
    }
    async update(id: string, update: Partial<PrismaUser>): Promise<User>{
        try {
            const updatedUser = await this.prisma.user.update({
            where:{
                id: id
            },
            data: update, select: this.select
        }) 
        return User.formData(updatedUser)

        } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 — это код Prisma для Unique constraint failed
        if (e.code === 'P2025') {
            throw new NotFoundException('Cannot update. User missing.'); 
        }
    }
        throw e; 
}}
    async delete(id: string): Promise<SafeUser>{
        try {
            return await this.prisma.user.delete({
            where:{
                id
            },
            select: this.select
        })  
        

        } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 — это код Prisma для Unique constraint failed
        if (e.code === 'P2025') {
            throw new NotFoundException('User not found for deletion.'); 
        }
    }
        throw e; 
}
        
    }   

}