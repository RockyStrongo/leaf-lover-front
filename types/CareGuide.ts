export interface CareGuide {
    id: number
    description: string
    careGuideTypeId: number
    plantId: number
  }

  export interface CareGuideWithDetails {
    id: number
    description: string
    careGuideTypeId: number
    plantId: number
    careGuideType: CareGuideType
  }
  
  export interface CareGuideType {
    id: number
    code: string
    label: string
  }