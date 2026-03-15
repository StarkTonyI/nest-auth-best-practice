export type JwtValidationResult =
  | { valid: true }
  | { valid: false; reason: 'invalid-user' | 'revoked' | 'invalid-email' | 'invalid-username' | 'invalid-id'}