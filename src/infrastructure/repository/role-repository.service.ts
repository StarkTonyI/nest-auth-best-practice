import { Injectable } from "@nestjs/common";
import { Role as PrismaRole } from "@prisma/client";
import { Role } from "src/core/entities/role.entity";
import { PrismaService } from "src/database/dataBase.service";

@Injectable()
export class RoleRepository{
    constructor(private readonly prisma: PrismaService){}

  async findById(id: string): Promise<Role | null>{
        const role = await this.prisma.role.findUnique({
            where:{
                id:id
            }
        })
        if(!role) return null;
        return this.roleMapper(role)
    }

    async updateRole(role: Partial<PrismaRole>): Promise<Role>{
        const updatedRole = await this.prisma.role.update({
            where:{ id: role.id },
            data:{
                role
            }
        })
        return this.roleMapper(updatedRole)
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
        return this.roleMapper(createdRole)
    }

    async findDefaultRole(){
        const findRole = await this.prisma.role.findFirst({
            where:{
                isDefault: true
            }
        })
        if(!findRole) return null;
        return this.roleMapper(findRole)
    }



    roleMapper(role: PrismaRole): Role {
        return Role.formData(role);
    }

}


