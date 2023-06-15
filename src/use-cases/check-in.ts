import { CheckInsRepository } from '@/repositories/check-ins.repository'
import { CheckIn } from '@prisma/client'

interface ICheckInUseCaseParams {
  userId: string
  gymId: string
}

interface ICheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(private readonly checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    gymId,
  }: ICheckInUseCaseParams): Promise<ICheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }
}
