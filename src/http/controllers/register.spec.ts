import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should register a new user', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoea@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
