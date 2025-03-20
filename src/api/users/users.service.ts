import { randomBytes } from 'node:crypto'
import { ConflictError } from '../errors/conflict-error'
import { hashService } from '../hash/hash.service'
import { mailService } from '../mail/mail.service'
import { usersRepository } from './users.repository'

type CreateUserParams = {
  name: string
  email: string
  role: 'admin' | 'writer'
}

export const usersService = {
  create: async ({ email, name, role }: CreateUserParams) => {
    const formattedEmail = email.toLowerCase()

    const foundUserByEmail = await usersRepository.findByEmail(formattedEmail)

    if (foundUserByEmail) {
      throw new ConflictError({
        message: `There is a user with the same identifier ${formattedEmail}`,
      })
    }

    const password = randomBytes(5).toString('hex')
    const passwordHash = await hashService.hash(password)

    const user = await usersRepository.create({
      email: formattedEmail,
      name,
      passwordHash,
      role,
    })

    await mailService.sendWelcome({
      to: { name, email: formattedEmail },
      params: { name, password, loginUrl: 'http://localhost:3000' },
    })

    return { user }
  },
}
