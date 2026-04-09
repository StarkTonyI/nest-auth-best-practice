import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/dataBase.service";
import { Prisma, Profile } from "@prisma/client";
import { iProfileRepository } from "src/interfaces/repository/profile-repository";
import { createProfilePayload } from "src/dto/request/profile/profile.dto";

@Injectable()
export class ProfileRepository implements iProfileRepository{
    constructor(private readonly prisma: PrismaService){};

    async create(profile: createProfilePayload): Promise<Profile>{
        const { userName, firstName, lastName, authId } = profile;

        try{
            return await this.prisma.profile.create({data: { 
                userName: userName.getValue(), lastName: lastName.getValue(), 
                firstName: firstName.getValue(), identityId: authId.getValue(), 
                bio: '', avatarUrl: ''
            } })
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
                identityId: authId
            }
        }))
    }
    async update(id: string, update: Partial<Profile>): Promise<Profile>{
        
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
                identityId: authId
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





