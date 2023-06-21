import { GymsRepository } from '@/repositories/gyms.repository'
import { Gym } from '@prisma/client'

interface ISearchGymUseCaseParams {
  query: string
  page: number
}

interface ISearchGymUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    page,
    query,
  }: ISearchGymUseCaseParams): Promise<ISearchGymUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}
