import { db } from '@/db/connection'
import { user as userSchema } from '@/db/schema/user'
import { ConflictError } from '@/errors/conflict-error'
import { randomUUIDv7 } from 'bun'
import { encrypt } from './encrypt'

async function findByEmail(email: string) {
  const user = await db.query.user.findFirst({
    where(fields, { eq }) {
      return eq(fields.email, email)
    },
  })

  return user
}

type CreateUserData = {
  email: string
  name: string
  role: 'admin' | 'writer'
  password: string
}

async function create({ email, name, role, password }: CreateUserData) {
  const formattedEmail = email.toLowerCase()

  const foundUserByEmail = await findByEmail(formattedEmail)

  if (foundUserByEmail) {
    throw new ConflictError({
      message: `There is a user with the same identifier ${formattedEmail}`,
    })
  }

  const passwordHash = await encrypt.hash(password)

  const [createdUser] = await db
    .insert(userSchema)
    .values({
      id: randomUUIDv7(),
      name,
      email: formattedEmail,
      passwordHash,
      role,
    })
    .returning()

  return createdUser
}

export const user = {
  findByEmail,
  create,
}
