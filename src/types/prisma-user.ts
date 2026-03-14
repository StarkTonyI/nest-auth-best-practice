// src/types/prisma-user.ts
import { Prisma } from '@prisma/client';

export const userSelect = {
  id: true,
  email: true,
  username: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

// тип безопасного пользователя (без пароля)
export type SafeUser = Prisma.UserGetPayload<{ select: typeof userSelect }>;

// если нужен пароль — отдельный select
export const userSelectWithPassword = {
  ...userSelect,
  password: true,
} as const;

export type UserWithPassword = Prisma.UserGetPayload<{ select: typeof userSelectWithPassword }>;


