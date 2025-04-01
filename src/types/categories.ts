import type { Id, Nullable } from './basic.ts'

export interface CategoriesParams {
  limit?: number // количество элементов на одной странице (по-умолчанию 100)
  offset?: number // смещение относительно первого элемента
  ordering?: string // Параметр сортировки id, -id
  public?: boolean // раздел доступен для всех (true/false)
}

export interface Category {
  id: Id
  name: { [key: string]: string }
  public?: boolean
  image_path: string
}

export interface CategoriesResponse {
  count: number
  next: Nullable<string>
  previous: Nullable<string>
  results: Category[]
}
