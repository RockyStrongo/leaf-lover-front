import type { UserPlant } from "./UserPlant"

export type Action = {
    id: number
    date: string
    done: boolean
    doneDate: string | null
    userPlantId: number
    actionTypeId: number
    type: ActionType
    userPlant: UserPlant
  }
  
  type ActionType = {
    id: number
    code: string
    label: string
  }
  