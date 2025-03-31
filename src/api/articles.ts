import api from './api.ts'
import type { ApiResponse } from '../types/api.ts'
import type { SearchArticlesParams, SearchArticlesResponse } from '../types/articles.ts'

// Полнотекстовый поиск статьи по параметрам
export const searchArticles = async (params: SearchArticlesParams) => {
  const response = await api.get<ApiResponse<SearchArticlesResponse>>('/search/articles/', {
    params: {
      search: params.search,
      category: params.category?.join(','),
      locale: params.locale,
      status: params.status?.join(','),
      cursor: params.cursor
    }
  })

  // if ('detail' in response.data) {
  //   throw new Error((response.data as ErrorResponse).detail)
  // }

  return response.data as SearchArticlesResponse
}
