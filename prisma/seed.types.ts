export enum SeedActionType {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

// Было SeedResourceType -> Стало SeedSeedResourceType
export enum SeedResourceType {
  USER = 'user',
  ROLE = 'role',
  STORAGE = 'storage',
  AUDIT = 'audit',
}