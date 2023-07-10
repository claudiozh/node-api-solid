import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to search gym by title ', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: 'Academia Boa Forma',
        description: 'Academia de musculação',
        latitude: -23.563099,
        longitude: -46.656571,
        phone: '11999999999',
      })

    await request(app.server)
      .post('/gyms')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: 'Academia Atividade',
        description: 'Academia de musculação',
        latitude: -23.563099,
        longitude: -46.656571,
        phone: '11999999999',
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'Atividade',
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms[0]).toHaveProperty('title', 'Academia Atividade')
  })
})
