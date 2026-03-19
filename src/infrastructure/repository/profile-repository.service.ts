import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/dataBase.service";
import RegisterUserDto from "../../auth/dto/registerUser.dto"; 
import { SafeUser, UserWithPassword } from '../../types/prisma-user'
import { Profile, User } from "@prisma/client";
import { IAuthRepository } from "../../interfaces/repository/auth-repository";
import { ProfileUserDto } from "src/dto/profile/profile.dto";
import { iProfileRepository } from "src/interfaces/repository/profile-repository";

@Injectable()
export class ProfileRepository implements iProfileRepository{
    constructor(private readonly prisma: PrismaService){};

    async create(profile: ProfileUserDto): Promise<Profile>{
        const { username, authId, lastname } = profile;
        return await this.prisma.profile.create({data: { username, lastname, authId } })
    }
    async findById(id: string): Promise<Profile | null> {
    return await this.prisma.profile.findUnique({
        where: { id }
    });
}
    async findByAuthId(authId: string): Promise<Profile | null>{
        return await this.prisma.profile.findUnique(({
            where:{
                authId
            }
        }))
    }
    async update(id: string, update: Partial<ProfileUserDto>): Promise<Profile>{
        return await this.prisma.profile.update({
            where:{
                id: id
            },
            data: update
        })
    }
    async delete(authId: string){
        return await this.prisma.profile.delete({
            where:{
                authId
            }
        })
    }
}





