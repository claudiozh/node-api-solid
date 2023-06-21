import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { FetchNearbyGymsUseCase } from '@/use-cases/fetch-nearby-gyms'

let gymsInsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

const nearLatitude = -6.1890466
const nearLongitude = -38.512907

const farLatitude = -6.1545453
const farLongitude = -38.3742153

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsInsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsInsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsInsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: nearLatitude,
      longitude: nearLongitude,
    })

    await gymsInsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: farLatitude,
      longitude: farLongitude,
    })

    const { gyms } = await sut.execute({
      userLatitude: nearLatitude,
      userLongitude: nearLongitude,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
