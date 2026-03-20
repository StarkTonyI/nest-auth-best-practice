import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/dataBase.service";
import RegisterUserDto from "../../auth/dto/registerUser.dto"; 
import { SafeUser, UserWithPassword } from '../../types/prisma-user'
import { Prisma, Profile, User } from "@prisma/client";
import { IAuthRepository } from "../../interfaces/repository/auth-repository";
import { ProfileUserDto } from "src/dto/profile/profile.dto";
import { iProfileRepository } from "src/interfaces/repository/profile-repository";

@Injectable()
export class ProfileRepository implements iProfileRepository{
    constructor(private readonly prisma: PrismaService){};

    async create(profile: ProfileUserDto): Promise<Profile>{
        const { username, authId, lastname } = profile;

        try{
            return await this.prisma.profile.create({data: { username, lastname, authId } })
        } catch (e) {
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                // P2002 — это код Prisma для Unique constraint failed
                if (e.code === 'P2002') {
                    throw new ConflictException('Profile already exists'); 
                }
            }
                throw e; 
        }


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
        
    try {
        return await this.prisma.profile.update({
            where:{
                id: id
            },
            data: update
        })
        } catch(err){
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                // P2002 — это код Prisma для Unique constraint failed
                if (err.code === 'P2002') {
                    throw new ConflictException('Cannot update. User is not exist!'); 
                }
            }
                throw err; 
        }
      
    }
    async delete(authId: string){
        try{
        return await this.prisma.profile.delete({
            where:{
                authId
            }
        })
        }catch(err){
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
                // P2002 — это код Prisma для Unique constraint failed
                if (err.code === 'P2002') {
                    throw new ConflictException('Cannot Delete. User is not exist!'); 
                }
            }
                throw err; 
        }
        
    }
}





