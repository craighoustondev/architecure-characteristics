export interface Characteristic {
  name: string
  description: string
  emoji: string
}

export interface Risk {
  id: string
  description: string
  probability: 1 | 2 | 3 | null
  impact: 1 | 2 | 3 | null
}
