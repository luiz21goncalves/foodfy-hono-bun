export type UserRole = 'admin' | 'writer'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}
