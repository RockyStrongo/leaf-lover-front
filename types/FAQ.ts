export interface FAQ {
    id: number
    question: string
    answer: string
    plantId: number | null
  }
  
export interface FaqApiResponse {
  faqs: FAQ[];
  totalPages: number;
  totalPlants: number;
  currentPage: number;
  perPage: number;
}