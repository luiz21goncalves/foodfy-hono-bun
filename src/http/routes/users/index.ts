import { Hono } from 'hono'
import { createUser } from './create-user'

export const usersRoutes = new Hono()

usersRoutes.route('/', createUser)
