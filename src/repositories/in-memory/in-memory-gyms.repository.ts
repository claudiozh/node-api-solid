import { Gym, Prisma } from '@prisma/client'
import {
  GymsRepository,
  IFindManyNearbyParams,
} from '@/repositories/gyms.repository'
import { randomUUID } from 'node:crypto'
import { ITEMS_PER_PAGE } from '@/constants/pagination'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    const gym = this.gyms.find((gym) => gym.id === id)

    if (!gym) {
      return null
    }

    return gym
  }

  async findManyNearby(params: IFindManyNearbyParams): Promise<Gym[]> {
    return this.gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates({
        from: {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        to: {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      })

      return distance < 10
    })
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const startIndex = (page - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE

    return this.gyms
      .filter((gym) => gym.title.includes(query))
      .slice(startIndex, endIndex)
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data?.id ?? randomUUID(),
      title: data.title,
      description: data?.description ?? null,
      phone: data?.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    }

    this.gyms.push(gym)

    return gym
  }
}
