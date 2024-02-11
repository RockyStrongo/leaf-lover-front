import type { Action } from './Action'
import type { Plant } from './Plant'

export type UserPlant = {
  id: number
  acquisitionDate: string
  nickname: string
  notes: string
  giftedBy: string
  plantId: number
  userId: number
  plant: Plant
  Action: Action[]
}

