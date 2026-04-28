
import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt'
import { PrismaPg } from "@prisma/adapter-pg";
import { SeedActionType, SeedResourceType } from "src/value-objects/permission-resourceAction.vo";

interface RolePermission {
  roleId: string,
  permissionId : string,
}

// Roles
const roles = [
  {
    name: 'admin',
    description: 'Administrator role with full access',
    isDefault: false,
  },
  {
    name: 'user',
    description: 'Default user role with limited access',
    isDefault: true,
  },
];

// Permissions
const permissions = [
  {
    name: 'user:read',
    description: 'Can read user information',
    resource: SeedResourceType.USER,
    action: SeedActionType.READ,
  },
  {
    name: 'user:create',
    description: 'Can create users',
    resource: SeedResourceType.USER,
    action: SeedActionType.CREATE,
  },
  {
    name: 'user:update',
    description: 'Can update user information',
    resource: SeedResourceType.USER,
    action: SeedActionType.UPDATE,
  },
  {
    name: 'user:delete',
    description: 'Can delete users',
    resource: SeedResourceType.USER,
    action: SeedActionType.DELETE,
  },
  {
    name: 'role:read',
    description: 'Can read role information',
    resource: SeedResourceType.ROLE,
    action: SeedActionType.READ,
  },
  {
    name: 'role:create',
    description: 'Can create roles',
    resource: SeedResourceType.ROLE,
    action: SeedActionType.CREATE,
  },
  {
    name: 'role:update',
    description: 'Can update roles',
    resource: SeedResourceType.ROLE,
    action: SeedActionType.UPDATE,
  },
  {
    name: 'role:delete',
    description: 'Can delete roles',
    resource: SeedResourceType.ROLE,
    action: SeedActionType.DELETE,
  },
  {
    name: 'storage:create',
    description: 'Can upload files',
    resource: SeedResourceType.STORAGE,
    action: SeedActionType.CREATE,
  },
  {
    name: 'storage:read',
    description: 'Can read file information',
    resource: SeedResourceType.STORAGE,
    action: SeedActionType.READ,
  },
  {
    name: 'storage:update',
    description: 'Can update file information',
    resource: SeedResourceType.STORAGE,
    action: SeedActionType.UPDATE,
  },
  {
    name: 'storage:delete',
    description: 'Can delete files',
    resource: SeedResourceType.STORAGE,
    action: SeedActionType.DELETE,
  },
  {
    name: 'audit:read',
    description: 'Can read audit logs',
    resource: SeedResourceType.AUDIT,
    action: SeedActionType.READ,
  },
];

// Map of role names to permissions they should have
const rolePermissionsMap = {
  admin: [
    'user:read',
    'user:create',
    'user:update',
    'user:delete',
    'role:read',
    'role:create',
    'role:update',
    'role:delete',
    'storage:create',
    'storage:read',
    'storage:update',
    'storage:delete',
    'audit:read',
  ],
  user: ['user:read', 'storage:create', 'storage:read', 'storage:update'],
};

// Default admin user
const adminUser = {
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  password: 'Admin@123', // This will be hashed before saving
};

function hashPassword(password: string){
  return bcrypt.hash(password, 10)
}

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });



async function main() {
  const start = performance.now();

  const adminPasswordHash = await hashPassword(adminUser.password);

  await prisma.$transaction(async (tx) => {
    console.log('Creating roles...');
    
    await tx.role.createMany({
      data: roles,
      skipDuplicates: true,
    });

    console.log('Creating permissions...');

    await tx.permission.createMany({
      data: permissions,
      skipDuplicates: true,
    });

    const [allRoles, allPermissions] = await Promise.all([
      tx.role.findMany({
        select: { id: true, name: true },
      }),
      tx.permission.findMany({
        select: { id: true, name: true },
      }),
    ]);

    const roleIdByName = new Map(allRoles.map((r) => [r.name, r.id]));
    const permissionIdByName = new Map(allPermissions.map((p) => [p.name, p.id]),);

    console.log('Assigning permissions to roles...');
    const rolePermissionRows:RolePermission[] = [];

    for (const [roleName, permissionNames] of Object.entries(rolePermissionsMap)) {
      const roleId = roleIdByName.get(roleName);
      if (!roleId) {
        console.error(`Role ${roleName} not found`);
        continue;
      }

      for (const permissionName of permissionNames) {
        const permissionId = permissionIdByName.get(permissionName);
        if (!permissionId) {
          console.error(`Permission ${permissionName} not found`);
          continue;
        }

        rolePermissionRows.push({
          roleId,
          permissionId,
        });
      }
    }

    if (rolePermissionRows.length > 0) {
      await tx.rolePermission.createMany({
        data: rolePermissionRows,
        skipDuplicates: true,
      });
    }

    console.log('Creating admin user...');
    const user = await tx.identity.upsert({
      where: { email: adminUser.email },
      update: {},
      create: {
        email: adminUser.email,
        passwordHash: adminPasswordHash,
      },
    });

    const adminRoleId = roleIdByName.get('admin');
    if (adminRoleId) {
      await tx.userRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: adminRoleId,
          },
        },
        update: {},
        create: {
          userId: user.id,
          roleId: adminRoleId,
        },
      });
    } else {
      console.error('Admin role not found');
    }
  });

  console.log(`Seed time: ${performance.now() - start} ms`);
  console.log('Seeding completed successfully!');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });









