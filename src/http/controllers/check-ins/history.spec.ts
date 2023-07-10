import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Check-in History (e2e)', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to list the history of check-ins', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const gymResponse = await request(app.server)
      .post('/gyms')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: 'Academia Boa Forma',
        description: 'Academia de musculação',
        phone: '11999999999',
        latitude: -23.563099,
        longitude: -46.656571,
      })

    await request(app.server)
      .post(`/gyms/${gymResponse.body.gym.id}/check-ins`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        latitude: -23.563099,
        longitude: -46.656571,
      })

    const checkInHistory = await request(app.server)
      .get('/check-ins/history')
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(checkInHistory.statusCode).toEqual(200)
    expect(checkInHistory.body.checkIns).toHaveLength(1)
    expect(checkInHistory.body.checkIns[0].id).toEqual(expect.any(String))
  })
})
