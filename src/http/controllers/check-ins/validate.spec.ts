import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Validate Check-in (e2e)', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to validate a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const gymResponse = await request(app.server)
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

    const checkInResponse = await request(app.server)
      .post(`/gyms/${gymResponse.body.gym.id}/check-ins`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        latitude: -23.563099,
        longitude: -46.656571,
      })

    const validateCheckInResponse = await request(app.server)
      .patch(`/check-ins/${checkInResponse.body.checkIn.id}/validate`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send()

    expect(validateCheckInResponse.statusCode).toEqual(204)

    const validatedCheckInResponse = await prisma.checkIn.findFirstOrThrow({
      where: {
        id: checkInResponse.body.checkIn.id,
      },
    })

    expect(validatedCheckInResponse.validated_at).toEqual(expect.any(Date))
  })
})
