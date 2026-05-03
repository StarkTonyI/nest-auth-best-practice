import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/dataBase.service";
import { defaultIdentitySelect } from '../../types/prisma-user'
import { Prisma } from "@prisma/client";
import { Identity } from "src/core/entities/Identity.entity";
import { iIdentityRepository } from "src/interfaces/repository/identity-repository";
import { Permission } from "src/core/entities/permission.entity";
import { Role } from "src/core/entities/role.entity";


type UserWithRelations = Prisma.IdentityGetPayload<{
  include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
}>
@Injectable()
export class IdentityRepository implements iIdentityRepository{
    select = defaultIdentitySelect;
    constructor(private readonly prisma: PrismaService){};

    async create(identity: Identity): Promise<Identity>{
        try {
            const userCreated = await this.prisma.identity.create({
                data: { 
                    email: identity.email.value,
                    passwordHash: identity.passwordHash, 
                    roles: {
                        create: identity.role.map((role)=>({
                            role: {
                                connect: { id:role.id.value }     
                            }
                        }))
                    }
                },
                include: {
                    roles: {
                        include: {
                            role: {
                                include:{
                                    permissions:{
                                        include: {
                                            permission:true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                })
            return this.mapToModel(userCreated as UserWithRelations)
                    
        } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 — это код Prisma для Unique constraint failed
            if (e.code === 'P2002') {
                throw new ConflictException('Email already exists'); 
            }
        }
        throw e; 
}}

    async findById(id: string): Promise<Identity | null> {

        const findIdentity =  await this.prisma.identity.findUnique({
            where: { id },
            include:{
                roles:{
                    include:{
                        role: {
                            include:{
                                permissions:{
                                    include: {
                                        permission: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
 
        if(!findIdentity) return null;

        return this.mapToModel(findIdentity)
}

    async findByEmail(email: string): Promise<Identity | null>{
    const findIdentity =  await this.prisma.identity.findUnique({
            where: { email },
            include:{
                roles:{
                    include:{
                        role: {
                            include:{
                                permissions:{
                                    include: {
                                        permission: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
 
        if(!findIdentity) return null;

        return this.mapToModel(findIdentity)
    }
   
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

    mapToModel(record: UserWithRelations): Identity{

        const roles = record.roles.map((roleRelation, index) => {
        const role = roleRelation.role;

        const permissionForm = role.permissions.map((permissionRelation)=>{
        const permission = permissionRelation.permission;       
            return Permission.fromData({ 
                id: permission.id, 
                resourceStr: permission.resource, 
                actionStr: permission.action, 
                description: permission.description, 
                createdAt: permission.createdAt, 
                updatedAt: permission.updatedAt
            })
        })  
     
        return Role.formData({ 
            id: role.id, 
            name: role.name, 
            description: role.description, 
            isDefault: role.isDefault, 
            createdAt: role.createdAt, 
            updatedAt: role.updatedAt }, 
            permissionForm)

    })

    return Identity.formData({ 
        id: record.id,
         email: record.email, 
         passwordHash:record.passwordHash, 
         createdAt: record.createdAt, 
         updatedAt: record.updatedAt, 
         roles
        })

}

}