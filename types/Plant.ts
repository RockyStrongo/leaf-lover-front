import type { CareGuide } from './CareGuide'
import type { FAQ } from './FAQ'
import type { UserPlant } from './UserPlant'

export interface Plant {
  id: number
  commonName: string
  scientificName: string
  description: string
  type: string
  watering: string
  flowers: boolean
  careLevel: string
  cuisine: boolean
  poisonousToHumans: boolean
  poisonousToPets: boolean
  wateringGeneralBenchmarkValue: number
  wateringGeneralBenchmarkUnit: string
  externalId: number
  defaultImageThumbnail: string
  defaultImageRegular: string
  CareGuide: CareGuide[]
  Faq: FAQ[]
  UserPlant: UserPlant[]
}

export interface PlantApiResponse {
  plants: Plant[]
  totalPages: number
  totalPlants: number
  currentPage: number
  perPage: number
  types:Type[]
  watering: Watering[]
  careLevel: Carelevel[]
}

export interface PlantInfo {
  id: number;
  plant: Plant;
}
export interface Type {
  id: string;
  value: string;
}
export interface Watering {
  id: string;
  value: string;
}
export interface Carelevel {
  id: string;
  careLevel: string;
}