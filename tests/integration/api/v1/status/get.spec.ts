import { describe, expect, setSystemTime, spyOn, test } from 'bun:test'
import { app } from '@/http/app'
import { status } from '@/models/status'

const PATH = '/api/v1/status'

describe(`GET ${PATH}`, () => {
  describe('Anonymous user', () => {
    test('Retrieving application status', async () => {
      const date = new Date()
      setSystemTime(date)

      const response = await app.request(PATH)
      const body = await response.json()

      setSystemTime()

      expect(response.status).toEqual(200)
      expect(body).toStrictEqual({
        updated_at: date.toISOString(),
        dependencies: {
          database: {
            version: '17.4',
            max_connections: 100,
            opened_connections: 1,
          },
        },
      })
    })
    test('Retrieving an internal error', async () => {
      const getVersionSpy = spyOn(status.database, 'getVersion')
      getVersionSpy.mockImplementationOnce(() => {
        throw new Error('Mock database error')
      })

      const response = await app.request(PATH)
      const body = await response.json()

      expect(response.status).toEqual(500)
      expect(body).toStrictEqual({
        message: 'An internal server error occurred.',
        name: 'InternalServerError',
        status_code: 500,
      })
    })
  })
})
