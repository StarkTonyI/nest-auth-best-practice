import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/dataBase.service";
import { defaultIdentitySelect, expendedParams, } from '../../types/prisma-user'
import { Prisma } from "@prisma/client";
import { Identity } from "src/core/entities/Identity.entity";
import { Identity as PrismaUser } from "@prisma/client";
import { iIdentityRepository } from "src/interfaces/repository/identity-repository";
@Injectable()
export class IdentityRepository implements iIdentityRepository{
    select = defaultIdentitySelect;
    constructor(private readonly prisma: PrismaService){};

    async create(identity: Identity): Promise<Identity>{
        try {
            const userCreated = await this.prisma.identity.create({
                data: { 
                    email: identity.userEmail.getValue,
                    passwordHash: identity.userPasswordHash, 
                    roles: {
                        create: identity.getRoles?.map((role)=>({
                            role: {
                                connect: { id:role.id.getValue }     
                            }
                        }))
                    }
                },
                include: {
                    roles: {
                        include: {
                            role: {
                                include:{
                                    permissions:true
                                }
                            }
                        }
                    }
                }
                })
            return Identity.formData({...userCreated, passwordHash:'' })
                    
        } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 — это код Prisma для Unique constraint failed
            if (e.code === 'P2002') {
                throw new ConflictException('Email already exists'); 
            }
        }
        throw e; 
}}

    async findById(id: string, expend:Partial<expendedParams>): Promise<Identity | null> {

        const findIdentity =  await this.prisma.identity.findUnique({
            where: { id },
            select: { ...this.select, ...expend}
        });
 
        if(!findIdentity) return null;

        return Identity.formData(findIdentity)

}

    async findByEmail(email: string, expend:Partial<expendedParams>): Promise<Identity | null>{
        const findUser = await this.prisma.identity.findUnique(({
            where:{
                email: email
            }, select: { ...this.select, ...expend}
        }))

        if(!findUser) return null;

        return Identity.formData(findUser)
    }
   
    async update(id: string, update: Partial<PrismaUser>): Promise<Identity>{
        try {
            const updatedUser = await this.prisma.identity.update({
            where:{
                id: id
            },
            data: update, select: this.select
        }) 
        return Identity.formData({...updatedUser, passwordHash: ''})

        } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 — это код Prisma для Unique constraint failed
        if (e.code === 'P2025') {
            throw new NotFoundException('Cannot update. User missing.'); 
        }
    }
        throw e; 
}}

    async delete(id: string){
        try {
            await this.prisma.identity.delete({
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