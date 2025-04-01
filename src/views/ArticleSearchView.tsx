import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import ArticleList from '../components/ArticleList.tsx'
import Filters from '../components/Filters.tsx'
import Layout from '../components/layout/Layout.tsx'
import {useArticleSearchFilters} from "../hooks/useArticleSearchFilters.ts";
import { useArticlesSearchQuery } from '../hooks/useArticlesSearchQuery.ts'
import { useDebounce } from '../hooks/useDebounce'
import { useErrorNotify } from '../hooks/useErrorNotify.ts'

const ArticleSearchView = () => {
  const { t } = useTranslation()
  const [searchParamsURL, setSearchParamsURL] = useSearchParams()
  const {filters, filtersQueriesLoading} = useArticleSearchFilters()

  const [searchInput, setSearchInput] = useState(searchParamsURL.get('search') || '')
  const debouncedSearchInput = useDebounce(searchInput, 755)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    setSearchParamsURL({
      ...Object.fromEntries(searchParamsURL.entries()),
      search: e.target.value
    })
  }

  const localeFilter = filters.find(filter => filter.name === 'locale')
  const categoriesFilter = filters.find(filter => filter.name === 'categories')
  const selectedLocale = localeFilter?.value
  const selectedCategories = categoriesFilter?.value || []

  const {
    data,
    isLoading: articlesQueryLoading,
    error: articlesError
  } = useArticlesSearchQuery({
    search: debouncedSearchInput,
    locale: selectedLocale,
    category: selectedCategories?.map((category) => category.value)
  })

  useErrorNotify([articlesError])
  const queriesLoading = filtersQueriesLoading || articlesQueryLoading

  return (
    <Layout
      isLoading={localeFilter?.isLoading || false}
      title={t('knowledge_base')}>
      <Filters className="mb-6" filters={filters} />

      <div className="mb-6">
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder={t('enter_phrase')}
          className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${queriesLoading ? 'bg-gray-100 text-gray-500' : ''}`}
          disabled={queriesLoading}
        />
      </div>

      <ArticleList
        data={data?.results}
        isLoading={articlesQueryLoading}
        articlesError={articlesError}
      />
    </Layout>
  )
}

export default ArticleSearchView
