import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { CreateGymUseCase } from '@/use-cases/create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Academia',
      description: 'Academia de musculação',
      phone: '123456789',
      latitude: 123,
      longitude: 456,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
