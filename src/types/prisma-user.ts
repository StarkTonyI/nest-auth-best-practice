export const defaultIdentitySelect = {
  id: true,
  email: true,
  createdAt: true,
  updatedAt: true,
} as const;

export interface expendedParams {
  profile: boolean,
  sessions: boolean, 
  passwordHash: boolean
}

