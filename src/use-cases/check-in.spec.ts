import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'
import { CheckInUseCase } from '@/use-cases/check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymRepository: InMemoryGymsRepository
let sut: CheckInUseCase

const latitude = -6.1890466
const longitude = -38.512907

describe('Check in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymRepository)

    gymRepository.gyms.push({
      id: 'gym-01',
      latitude: new Decimal(latitude),
      longitude: new Decimal(longitude),
      description: 'Gym 01',
      phone: '00000000000',
      title: 'Gym 01',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: latitude,
      userLongitude: longitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: latitude,
      userLongitude: longitude,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: latitude,
        userLongitude: longitude,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: latitude,
      userLongitude: longitude,
    })

    vi.setSystemTime(new Date(2023, 0, 2, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: latitude,
      userLongitude: longitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymRepository.gyms.push({
      id: 'gym-02',
      latitude: new Decimal(-6.199619),
      longitude: new Decimal(-38.4989977),
      description: 'Gym 02',
      phone: '00000000000',
      title: 'Gym 02',
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: latitude,
        userLongitude: longitude,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
