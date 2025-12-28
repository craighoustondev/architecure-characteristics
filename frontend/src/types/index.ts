export interface Characteristic {
  name: string
  description: string
}

export interface Risk {
  id: string
  description: string
  probability: 1 | 2 | 3 | null
  impact: 1 | 2 | 3 | null
}
