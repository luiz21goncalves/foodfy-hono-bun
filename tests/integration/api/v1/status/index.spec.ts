import { describe, expect, setSystemTime, test } from 'bun:test'

import { app } from '@/http/app'

const PATH = '/api/v1/status'

describe(`GET ${PATH}`, () => {
  describe('Anonymous user', () => {
    test('Retrieving root page', async () => {
      const date = new Date()
      setSystemTime(date)

      const response = await app.request(PATH)
      const body = await response.json()

      expect(response.status).toEqual(200)
      expect(body).toStrictEqual({
        updated_at: date.toISOString(),
        dependencies: {},
      })
    })
  })
})
