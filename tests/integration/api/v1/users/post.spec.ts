import { describe, expect, test } from 'bun:test'
import { app } from '@/http/app'
import { user } from '@/models/user'
import { faker } from '@faker-js/faker'

const PATH = '/api/v1/users'

describe(`POST ${PATH}`, () => {
  describe('Anonymous user', () => {
    test('With unique and valid data', async () => {
      const name = faker.person.fullName()
      const email = faker.internet.email()
      const role = faker.helpers.arrayElement(['admin', 'writer'])

      const response = await app.request(PATH, {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          role,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
      const body = await response.json()

      expect(response.status).toEqual(201)
      expect(body).toStrictEqual({
        user: {
          id: expect.any(String),
          name,
          email: email.toLowerCase(),
          role,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      })
    })

    test('With invalid "email"', async () => {
      const name = faker.person.fullName()
      const email = 'invalid-email'
      const role = faker.helpers.arrayElement(['admin', 'writer'])

      const response = await app.request(PATH, {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          role,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
      const body = await response.json()

      expect(response.status).toEqual(400)
      expect(body).toStrictEqual({
        name: 'ValidationError',
        status_code: 400,
        message: 'A validation error occurred.',
        details: { email: ['Invalid email'] },
      })
    })

    test('With invalid "role"', async () => {
      const name = faker.person.fullName()
      const email = faker.internet.email()
      const role = 'invalid-role'

      const response = await app.request(PATH, {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          role,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
      const body = await response.json()

      expect(response.status).toEqual(400)
      expect(body).toStrictEqual({
        name: 'ValidationError',
        status_code: 400,
        message: 'A validation error occurred.',
        details: {
          role: [
            "Invalid enum value. Expected 'admin' | 'writer', received 'invalid-role'",
          ],
        },
      })
    })

    test('With invalid "name"', async () => {
      const name = ''
      const email = faker.internet.email()
      const role = faker.helpers.arrayElement(['admin', 'writer'])

      const response = await app.request(PATH, {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          role,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
      const body = await response.json()

      expect(response.status).toEqual(400)
      expect(body).toStrictEqual({
        name: 'ValidationError',
        status_code: 400,
        message: 'A validation error occurred.',
        details: { name: ['String must contain at least 1 character(s)'] },
      })
    })

    test('With duplicated "email"', async () => {
      const name = faker.person.fullName()
      const email = 'duplicated@email.com'
      const role = faker.helpers.arrayElement(['admin', 'writer'])
      await user.create({
        email,
        name,
        password: 'pass_123',
        role,
      })

      const response = await app.request(PATH, {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          role,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
      const body = await response.json()

      expect(response.status).toEqual(409)
      expect(body).toStrictEqual({
        name: 'ConflictError',
        status_code: 409,
        message: `There is a user with the same identifier ${email.toLowerCase()}`,
      })
    })
  })
})
