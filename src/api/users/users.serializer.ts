import type { User } from './users.types'

export const userSerializer = {
  toResponse: (user: User) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    }
  },
}
