import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Check-in Metrics (e2e)', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to get total count of check-ins', async () => {
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

    const checkInMetrics = await request(app.server)
      .get('/check-ins/metrics')
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(checkInMetrics.statusCode).toEqual(200)
    expect(checkInMetrics.body.checkInsCount).toEqual(1)
  })
})
