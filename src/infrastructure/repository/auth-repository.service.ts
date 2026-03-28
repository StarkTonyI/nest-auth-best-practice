import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/dataBase.service";
import { SafeUser, userSelect, userSelectWithPassword, UserWithPassword } from '../../types/prisma-user'
import { Prisma, User } from "@prisma/client";
import { IAuthRepository } from "../../interfaces/repository/auth-repository";
import RegisterUserDto from "src/dto/request/auth/registerUser.dto";

@Injectable()
export class AuthRepository implements IAuthRepository{
    private readonly select = userSelect;
    private readonly selectWithPassword = userSelectWithPassword;

    constructor(private readonly prisma: PrismaService){};

    async create(user: RegisterUserDto): Promise<SafeUser>{
        const { email, password, username, role } = user;
        try {
            return await this.prisma.user.create({data: { email, password, role, username, refreshToken:'', revoked: true },  select:this.select })
        } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 — это код Prisma для Unique constraint failed
        if (e.code === 'P2002') {
            throw new ConflictException('Email already exists'); 
        }
    }
        throw e; 
}}
    async findById(id: string, withPassword?: boolean): Promise<UserWithPassword | SafeUser | null> {
    return await this.prisma.user.findUnique({
        where: { id },
        select: withPassword ? this.selectWithPassword : this.select
    });
}
    async findByEmail(email: string, withPassword?: boolean): Promise<SafeUser | UserWithPassword | null>{
        return await this.prisma.user.findUnique(({
            where:{
                email: email
            }, select: withPassword ? this.selectWithPassword : this.select
        }))
    }
    async update(id: string, update: Partial<User>): Promise<SafeUser>{
        try {
            return await this.prisma.user.update({
            where:{
                id: id
            },
            data: update, select: this.select
        })
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