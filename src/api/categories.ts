import api from './api.ts'
import type { CategoriesParams, CategoriesResponse } from '../types/categories.ts'
import type { ApiResponse } from '../types/api.ts'

// Запрос для получения списка категорий
export const getCategories = async (params: CategoriesParams) => {
  const response = await api.get<ApiResponse<CategoriesResponse>>('/categories/', {
    params: {
      limit: params.limit,
      offset: params.offset,
      ordering: params.ordering,
      public: params.public
    }
  })
  return response.data as CategoriesResponse
}
