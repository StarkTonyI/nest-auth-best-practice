import { Injectable } from "@nestjs/common";
import { Prisma, Role as PrismaRole } from "@prisma/client";
import { Permission } from "src/core/entities/permission.entity";
import { Role } from "src/core/entities/role.entity";
import { PrismaService } from "src/database/dataBase.service";

type UserWithRelations = Prisma.RoleGetPayload<{
 include: { permissions:{ include: { permission: true } } }
}>
@Injectable()
export class RoleRepository{
    constructor(private readonly prisma: PrismaService){}

    async findByRoleName(name: string): Promise<Role | null>{
        const role = await this.prisma.role.findUnique({
        where: { name: name },
            include:{
                permissions:{
                    include: {
                        permission: true
                    }
                }
            }
        })
        if(!role) {
            return null;
        }

        return this.roleMapper(role as UserWithRelations)
}


    async deleteRole(roleId: string): Promise<void>{
        await this.prisma.role.deleteMany({
            where:{
                id: roleId
            }
        })
    }

    async createRole(role: Role):Promise<Role>{
        const createdRole = await this.prisma.role.create({
            data:{
                id: role.id.getValue,
                name: role.name,
                description: role.description,
                isDefault: role.isDefault,
                createdAt: role.createdAt,
                updatedAt: role.updatedAt
            }
        })
        return this.roleMapper(createdRole as UserWithRelations)
    }

    async findDefaultRole(){
        const findRole = await this.prisma.role.findFirst({
            where:{
                isDefault: true
            },
            include:{
                permissions:{
                    include:{
                        permission:true
                    }
                }
            }
        })
        if(!findRole) return null;
        return this.roleMapper(findRole as UserWithRelations)
    }



    roleMapper(role: UserWithRelations): Role {
        const { id, name, description, isDefault, createdAt, updatedAt } = role;
        const permissions = role.permissions.map((permissionRelate)=>{
            const permission = permissionRelate.permission;
            const { id, description, resource, action, createdAt, updatedAt } = permission;
            return Permission.fromData({
                id, description, 
                resourceStr:  resource, 
                actionStr: action, 
                createdAt, 
                updatedAt
            })
        })

        return Role.formData({ id, name, description,isDefault, createdAt, updatedAt }, permissions)

    }

}


