import { expect, describe, it, beforeEach } from 'vitest'
import { ITEMS_PER_PAGE } from '@/constants/pagination'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { SearchGymsUseCase } from '@/use-cases/search-gyms'

let gymsInsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

const latitude = -6.1890466
const longitude = -38.512907

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymsInsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsInsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsInsRepository.create({
      title: 'Javascript Gym',
      description: null,
      phone: null,
      latitude,
      longitude,
    })

    await gymsInsRepository.create({
      title: 'Typescript Gym',
      description: null,
      phone: null,
      latitude,
      longitude,
    })

    const { gyms } = await sut.execute({
      query: 'Javascript Gym',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Javascript Gym' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= ITEMS_PER_PAGE + 2; i++) {
      await gymsInsRepository.create({
        title: `Javascript Gym ${i}`,
        description: null,
        phone: null,
        latitude,
        longitude,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: `Javascript Gym ${ITEMS_PER_PAGE + 1}`,
      }),
      expect.objectContaining({
        title: `Javascript Gym ${ITEMS_PER_PAGE + 2}`,
      }),
    ])
  })
})
