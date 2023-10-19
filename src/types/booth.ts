export interface Booth {
  id: string
  name: string
  organizer: string
  location: string
  floor?: string
  area?: string
  memo?: string
  status: 'open' | 'closed' | 'break' | 'preparing'
  waiting: number
}
