import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '../validator'
import { userSerializer } from './users.serializer'
import { usersService } from './users.service'

export const usersRoutes = new Hono().post(
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

    const { user } = await usersService.create({ email, name, role })

    const serializedUser = userSerializer.toResponse(user)

    return c.json({ user: serializedUser }, 201)
  }
)
