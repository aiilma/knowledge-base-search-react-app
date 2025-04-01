import api from './api.ts'
import type { ApiResponse } from '../types/api.ts'
import type { CategoriesParams, CategoriesResponse } from '../types/categories.ts'

// Запрос для получения списка категорий
export const getCategories = async (params: CategoriesParams): Promise<CategoriesResponse> => {
  try {
    const response = await api.get<ApiResponse<CategoriesResponse>>('/categories/', {
      params: {
        limit: params.limit,
        offset: params.offset,
        ordering: params.ordering,
        public: params.public
      }
    })

    if ('detail' in response.data) {
      throw new Error(response.data.detail)
    }

    return response.data as CategoriesResponse
  } catch (error) {
    console.error('Error fetching articles:', error)
    throw error
  }
}
