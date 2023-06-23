import { SearchGymsUseCase } from '@/use-cases/search-gyms'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms.repository'

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new SearchGymsUseCase(gymsRepository)

  return useCase
}
