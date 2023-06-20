import { CheckInsRepository } from '@/repositories/check-ins.repository'

interface IGetUserMetricsUseCaseParams {
  userId: string
}

interface IGetUserMetricsUseCaseResponse {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private readonly checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: IGetUserMetricsUseCaseParams): Promise<IGetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
