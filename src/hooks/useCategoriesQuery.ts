import { CategoriesParams } from '../types/categories.ts'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../api/categories.ts'

export const useCategoriesQuery = (params: CategoriesParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['/categories/'],
    queryFn: () => getCategories(params),
    enabled
  })
}
