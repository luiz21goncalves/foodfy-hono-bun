import { db } from '@/api/db/connection'
import { user } from '@/api/db/schema'
import { randomUUIDv7 } from 'bun'

type CreateUserData = {
  email: string
  name: string
  role: 'admin' | 'writer'
  passwordHash: string
}

export const usersRepository = {
  findByEmail: async (email: string) => {
    const user = await db.query.user.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email)
      },
    })

    return user
  },
  create: async ({ email, name, passwordHash, role }: CreateUserData) => {
    const [createdUser] = await db
      .insert(user)
      .values({
        id: randomUUIDv7(),
        name,
        email,
        passwordHash,
        role,
      })
      .returning()

    return createdUser
  },
}
