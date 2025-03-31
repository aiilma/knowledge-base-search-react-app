import { SearchArticlesParams } from '../types/articles'
import { useQuery } from '@tanstack/react-query'
import { searchArticles } from '../api/articles.ts'

export const useArticlesSearchQuery = (params: SearchArticlesParams) => {
  return useQuery({
    queryKey: ['/search/articles/', params.search, params.category, params.locale],
    queryFn: () => searchArticles(params),
    enabled: !!params.search
  })
}
