import { Injectable } from "@nestjs/common";
import { Permission as PrismaPermission } from "@prisma/client";
import { Permission } from "src/core/entities/permission.entity";
import { PrismaService } from "src/database/dataBase.service";
import { ThrottlingException } from "src/exeption/domain-exeptions";

@Injectable()
export class PermissionRepository {
    
    constructor(private readonly prisma: PrismaService){};

    async findById(id: string){
        const findPermission = await this.prisma.permission.findUnique({
            where:{
                id: id
            }
        })
        if(!findPermission) return null;
        return this.mapToModel(findPermission);
    }

    async findByName(name: string){
        const findPermission = await this.prisma.permission.findUnique({
            where:{
                name: name
            }
        })
        if(!findPermission) return null;
        return this.mapToModel(findPermission);
    }

    async create(permission: Permission): Promise<Permission>{
        const permissionCreated = await this.prisma.permission.create({
            data: {
                id: permission.id.value,
                resource: permission.resourceAction.resource,
                action: permission.resourceAction.action,
                name: permission.name,
                description: permission.description,
            }
        })
        return this.mapToModel(permissionCreated)
    }

    mapToModel(permission: PrismaPermission): Permission{
        const { id, resource, action, description, createdAt, updatedAt } = permission;
        return Permission.fromData({
            id, 
            resourceStr: resource,
            actionStr: action,
            description,
            createdAt,
            updatedAt
        })



    }


}