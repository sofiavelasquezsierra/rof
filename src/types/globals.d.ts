export {}

// Create a type for the roles
export type Roles = 'admin' | 'club' | 'student'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}