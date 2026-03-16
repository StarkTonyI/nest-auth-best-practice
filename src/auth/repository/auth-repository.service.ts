import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/database/dataBase.service";
import RegisterUserDto from "../dto/registerUser.dto"; 
import { SafeUser, userSelect, userSelectWithPassword, UserWithPassword } from '../../types/prisma-user'
import { User } from "@prisma/client";
import { IAuthRepository } from "../domains/interfaces/authRepository.interface";

@Injectable()
export class AuthRepository implements IAuthRepository{
    private readonly select = userSelect;
    private readonly selectWithPassword = userSelectWithPassword;

    constructor(private readonly prisma: PrismaService){};

    async create(user: RegisterUserDto): Promise<SafeUser>{
        const { email, password, username, role } = user;
        return await this.prisma.user.create({data: { email, password, role, username, refreshToken:'', revoked: true },  select:this.select })
    }
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
        return await this.prisma.user.update({
            where:{
                id: id
            },
            data: update, select: this.select
        })
    }








    
}





