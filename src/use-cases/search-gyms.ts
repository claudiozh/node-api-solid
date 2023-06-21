import { GymsRepository } from '@/repositories/gyms.repository'
import { Gym } from '@prisma/client'

interface ISearchGymsUseCaseParams {
  query: string
  page: number
}

interface ISearchGymsUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    page,
    query,
  }: ISearchGymsUseCaseParams): Promise<ISearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}
