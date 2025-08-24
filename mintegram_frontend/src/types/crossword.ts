// tipuri de bază
export type Direction = 'across' | 'down'

export interface Cell {
  row: number
  col: number
  is_block: boolean
  solution?: string | null
  number?: number | null
}

export interface Clue {
  number: number
  direction: Direction
  text: string
  answer: string
  start_row: number
  start_col: number
}

export interface Puzzle {
  id: number
  title: string
  language: string
  rows: number
  cols: number
  notes?: string
  photo?: string | null
  cells: Cell[]
  clues: Clue[]
}
