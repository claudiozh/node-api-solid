import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to get profile', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoea@example.com',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/auth').send({
      email: 'johndoea@example.com',
      password: '123456',
    })

    const { token } = authResponse.body

    const profileResponse = await request(app.server)
      .get('/me')
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toHaveProperty(
      'email',
      'johndoea@example.com',
    )
  })
})
