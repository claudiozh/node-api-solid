import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins.repository'
import { FetchUserCheckInsHistoryUseCase } from '@/use-cases/fetch-user-check-ins-history'

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepositoryRepository = new PrismaCheckInsRepository()
  const useCase = new FetchUserCheckInsHistoryUseCase(
    checkInsRepositoryRepository,
  )

  return useCase
}
