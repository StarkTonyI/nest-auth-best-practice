import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/dataBase.service";
import RegisterUserDto from "../dto/registerUser.dto"; 
import { SafeUser, userSelect, userSelectWithPassword } from '../../types/prisma-user'
import { User } from "@prisma/client";

@Injectable()
export class AuthRepository {
    private readonly select = userSelect;
    private readonly selectWithPassword = userSelectWithPassword;

    constructor(private readonly prisma: PrismaService){};

    async create(user: RegisterUserDto): Promise<SafeUser>{
        const { email, password, username, role } = user;
        return await this.prisma.user.create({data: { email, password, role, username, refreshToken:'' },  select:this.select })
    }
    async findById(id: string, withPassword: boolean = false){
        return await this.prisma.user.findUnique({
            where:{
                id: id
            }, select: withPassword ? this.selectWithPassword : this.select
        })
    }
    async findByEmail(email: string, withPassword: boolean = false){
        return await this.prisma.user.findUnique(({
            where:{
                email: email
            }, select: withPassword ? this.selectWithPassword : this.select
        }))
    }

    async update(id: string, update: Partial<User>): Promise<SafeUser>{
        console.log(id);
        console.log(update)
        return await this.prisma.user.update({
            where:{
                id: id
            },
            data: update, select: this.select
        })
    }








    
}