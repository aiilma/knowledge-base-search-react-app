import React, { useRef, useEffect, useState } from 'react'
import Select, { SingleValue } from 'react-select'
import { Article, SearchArticlesParams } from '../types/articles'
import { useInstanceQuery } from '../hooks/useInstanceQuery'
import { Locale } from '../types/instance'
import { useCategoriesQuery } from '../hooks/useCategoriesQuery.ts'
import { useArticlesSearchQuery } from '../hooks/useArticlesSearchQuery.ts'
import { Id, Nullable } from '../types/basic.ts'
import ReactMarkdown from 'react-markdown'

const localeLabels: { [key in Locale]: string } = {
  [Locale.RU]: 'Русский',
  [Locale.EN]: 'English'
}

const getLocaleLabel = (locale: Locale): string => {
  return localeLabels[locale] || 'Unknown'
}

const renderers = {
  img: ({ src }: { alt?: string; src?: string }) => (
    <a href={src} target="_blank" rel="noopener noreferrer" className="text-blue-500 block">
      Изображение
    </a>
  )
}

const ArticleSearchView = () => {
  const [searchParams, setSearchParams] = useState<SearchArticlesParams>({
    search: '',
    locale: undefined,
    category: []
  })
  const [selectedLocale, setSelectedLocale] =
    useState<SingleValue<{ value: string; label: string }>>(null)
  const [isLocaleQueryEnabled, setIsLocaleQueryEnabled] = useState(true)
  const prevLocaleRef = useRef<Locale | undefined>(undefined)
  const [openArticleId, setOpenArticleId] = useState<Nullable<Article['id']>>(null)

  const { data: instanceData, isLoading: instanceDataLoading } =
    useInstanceQuery(isLocaleQueryEnabled)
  const { data: categoriesData, isLoading: categoriesDataLoading } = useCategoriesQuery(
    {},
    searchParams.locale !== prevLocaleRef.current
  )
  const { data, isLoading, error } = useArticlesSearchQuery(searchParams)

  useEffect(() => {
    if (instanceData) {
      const defaultLocale = instanceData.default_locale as Locale
      setSearchParams((prevParams) => ({
        ...prevParams,
        locale: defaultLocale
      }))
      setSelectedLocale({
        value: defaultLocale,
        label: getLocaleLabel(defaultLocale)
      })
      setIsLocaleQueryEnabled(false)
    }
  }, [instanceData])

  useEffect(() => {
    prevLocaleRef.current = searchParams.locale
  }, [searchParams.locale])

  const handleLocaleChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
    if (selectedOption) {
      setSearchParams((prevParams) => ({
        ...prevParams,
        locale: selectedOption.value as Locale
      }))
      setSelectedLocale(selectedOption)
    }
  }

  const handleCategoryChange = (selectedOptions: any) => {
    const selectedCategories = selectedOptions
      ? selectedOptions.map((option: any) => option.value)
      : []
    setSearchParams((prevParams) => ({
      ...prevParams,
      category: selectedCategories
    }))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ ...searchParams, search: e.target.value })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString(searchParams.locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const toggleHighlight = (id: Id) => {
    setOpenArticleId(openArticleId === id ? null : id)
  }

  const queriesLoading = instanceDataLoading || categoriesDataLoading || isLoading

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">База знаний</h1>

      <div className="mb-6">
        <Select
          options={instanceData?.locales.map((loc: Locale) => ({
            value: loc,
            label: getLocaleLabel(loc)
          }))}
          onChange={handleLocaleChange}
          value={selectedLocale}
          className="w-full"
          placeholder={instanceDataLoading ? 'Загрузка...' : 'Выберите локаль...'}
          isDisabled={queriesLoading}
        />
      </div>

      <div className="mb-6">
        <Select
          isMulti
          options={categoriesData?.results.map((category) => ({
            value: category.id,
            label: category.name[selectedLocale?.value as Locale]
          }))}
          onChange={handleCategoryChange}
          className="w-full"
          placeholder={categoriesDataLoading ? 'Загрузка...' : 'Выберите разделы статей...'}
          isDisabled={queriesLoading}
        />
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={searchParams.search}
          onChange={handleSearchChange}
          placeholder="Введите фразу статьи..."
          className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${queriesLoading ? 'bg-gray-100 text-gray-500' : ''}`}
          disabled={queriesLoading}
        />
      </div>

      {isLoading && <p className="text-blue-500 text-center">Загрузка...</p>}
      {error && <p className="text-red-500 text-center">Ошибка загрузки данных</p>}
      {!isLoading && !data?.results.length && (
        <p className="text-gray-500 text-center">Нет данных</p>
      )}
      <ul className="space-y-6">
        {data?.results.map((article: Article) => (
          <li key={article.id} className="p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-700">ID:</span>
              <span className="text-gray-600">{article.id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-700">Ext ID:</span>
              <span className="text-gray-600">{article.ext_id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-700">Ранг:</span>
              <span className="text-gray-600">{article.rank}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-700">Статус:</span>
              <span
                className={`text-sm ${article.status === 'PUBLISHED' ? 'text-green-500' : 'text-yellow-500'}`}>
                {article.status}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-700">Дата создания:</span>
              <span className="text-gray-600">{formatDateTime(article.created_at)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-700">Дата обновления:</span>
              <span className="text-gray-600">{formatDateTime(article.updated_at)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-700">Дата публикации:</span>
              <span className="text-gray-600">
                {article.published_at ? formatDateTime(article.published_at) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-700">Автор:</span>
              <span className="text-gray-600">{article.author}</span>
            </div>
            <div className="flex flex-col mt-4">
              <button
                onClick={() => toggleHighlight(article.id)}
                className="font-bold text-gray-700 mb-2 text-left focus:outline-none">
                Highlight {openArticleId === article.id ? '▲' : '▼'}
              </button>
              <div
                className={`transition-max-height duration-500 ease-in-out overflow-hidden ${openArticleId === article.id ? 'max-h-screen' : 'max-h-0'}`}>
                <ul className="list-disc list-inside text-gray-600">
                  {Object.entries(article.highlight).map(([key, value]) => (
                    <li key={key} className="mb-1">
                      <span className="font-bold">{key}:</span>
                      {key === 'body' ? (
                        <ReactMarkdown components={renderers}>{value}</ReactMarkdown>
                      ) : (
                        value
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <pre className="mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
        {JSON.stringify(searchParams, null, 2)}
      </pre>
    </div>
  )
}

export default ArticleSearchView
