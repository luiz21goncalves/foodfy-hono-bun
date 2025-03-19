import { randomBytes } from 'node:crypto'
import { zValidator } from '@/http/validator'
import { user } from '@/models/user'
import { Hono } from 'hono'
import { z } from 'zod'

export const createUser = new Hono().post(
  '/',
  zValidator(
    'json',
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      role: z.enum(['admin', 'writer']),
    })
  ),
  async (c) => {
    const { email, name, role } = c.req.valid('json')

    const password = randomBytes(5).toString('hex')

    const createdUser = await user.create({ email, name, password, role })

    return c.json(
      {
        user: {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
          role: createdUser.role,
          created_at: createdUser.createdAt,
          updated_at: createdUser.updatedAt,
        },
      },
      201
    )
  }
)
