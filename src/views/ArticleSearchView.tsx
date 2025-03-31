import React, { useEffect, useState } from 'react'
import Select, { SingleValue } from 'react-select'
import { Article } from '../types/articles'
import { useInstanceQuery } from '../hooks/useInstanceQuery'
import { Locale } from '../types/instance'
import { useCategoriesQuery } from '../hooks/useCategoriesQuery.ts'
import { useArticlesSearchQuery } from '../hooks/useArticlesSearchQuery.ts'
import { Id, Nullable } from '../types/basic.ts'
import ReactMarkdown from 'react-markdown'
import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'
import { ClipLoader } from 'react-spinners'

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
  const { t } = useTranslation()
  const [searchParamsURL, setSearchParamsURL] = useSearchParams()

  // local state
  const [selectedLocale, setSelectedLocale] = useState<
    SingleValue<{ value: Locale; label: string }>
  >(
    searchParamsURL.get('locale')
      ? {
          value: searchParamsURL.get('locale') as Locale,
          label: getLocaleLabel(searchParamsURL.get('locale') as Locale)
        }
      : null
  )
  const [selectedCategories, setSelectedCategories] = useState<{ value: number; label: string }[]>(
    []
  )
  const [searchInput, setSearchInput] = useState(searchParamsURL.get('search') || '')
  const [isLocaleQueryEnabled, setIsLocaleQueryEnabled] = useState(true)
  const [openArticleId, setOpenArticleId] = useState<Nullable<Article['id']>>(null)

  // queries
  const { data: instanceData, isLoading: instanceDataLoading } =
    useInstanceQuery(isLocaleQueryEnabled)
  const { data: categoriesData, isLoading: categoriesDataLoading } = useCategoriesQuery({}, true)
  const { data, isLoading, error } = useArticlesSearchQuery({
    search: searchInput,
    locale: selectedLocale?.value,
    category: selectedCategories.map((category) => category.value)
  })

  // инициализация локали из query-параметров
  useEffect(() => {
    if (instanceData) {
      const queryLocale = searchParamsURL.get('locale') as Locale

      if (queryLocale && instanceData.locales.includes(queryLocale)) {
        setSelectedLocale({
          value: queryLocale,
          label: getLocaleLabel(queryLocale)
        })
        i18n.changeLanguage(queryLocale)
      } else {
        const defaultLocale = instanceData.default_locale as Locale
        // setSearchParamsURL({ locale: defaultLocale })
        setSelectedLocale({
          value: defaultLocale,
          label: getLocaleLabel(defaultLocale)
        })
        i18n.changeLanguage(defaultLocale)
      }
      setIsLocaleQueryEnabled(false)
    }
  }, [instanceData, searchParamsURL, setSearchParamsURL])

  // инициализация категорий из query-параметров
  useEffect(() => {
    if (categoriesData) {
      const queryCategories = searchParamsURL.get('category')
      if (queryCategories) {
        const selectedOptions = queryCategories.split(',').map((id) => ({
          value: Number(id),
          label:
            categoriesData.results.find((category) => category.id === Number(id))?.name[
              selectedLocale?.value as Locale
            ] || ''
        }))
        setSelectedCategories(selectedOptions)
      }
    }
  }, [categoriesData, searchParamsURL, selectedLocale])

  const handleLocaleChange = (selectedOption: SingleValue<{ value: Locale; label: string }>) => {
    if (selectedOption) {
      setSelectedLocale(selectedOption)
      setSearchParamsURL({
        ...Object.fromEntries(searchParamsURL.entries()),
        locale: selectedOption.value
      })
      i18n.changeLanguage(selectedOption.value)
    }
  }

  const handleCategoryChange = (selectedOptions: any) => {
    const selectedCategories = selectedOptions
      ? selectedOptions.map((option: any) => option.value).join(',')
      : ''
    setSelectedCategories(selectedOptions)
    setSearchParamsURL({
      ...Object.fromEntries(searchParamsURL.entries()),
      category: selectedCategories
    })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    setSearchParamsURL({ ...Object.fromEntries(searchParamsURL.entries()), search: e.target.value })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString(selectedLocale?.value as Locale, {
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

  if (isLocaleQueryEnabled) {
    return (
      <div className={`flex items-center justify-center h-screen fade-out`}>
        <ClipLoader size={150} color={"#123abc"} loading={isLocaleQueryEnabled} />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">{t('knowledge_base')}</h1>

      <div className="mb-6">
        <Select
          options={instanceData?.locales.map((loc: Locale) => ({
            value: loc,
            label: getLocaleLabel(loc)
          }))}
          onChange={handleLocaleChange}
          value={selectedLocale}
          className="w-full"
          placeholder={instanceDataLoading ? t('loading') : t('select_locale')}
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
          value={selectedCategories}
          className="w-full"
          placeholder={categoriesDataLoading ? t('loading') : t('select_categories')}
          isDisabled={queriesLoading}
        />
      </div>

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

      {isLoading && <p className="text-blue-500 text-center">{t('loading')}</p>}
      {error && <p className="text-red-500 text-center">{t('error_loading')}</p>}
      {!isLoading && !data?.results.length && (
        <p className="text-gray-500 text-center">{t('no_data')}</p>
      )}
      <ul className="space-y-6">
        {data?.results.map((article: Article) => (
          <li key={article.id} className="p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-700">{t('id')}:</span>
              <span className="text-gray-600">{article.id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-700">{t('ext_id')}:</span>
              <span className="text-gray-600">{article.ext_id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-700">{t('rank')}:</span>
              <span className="text-gray-600">{article.rank}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-700">{t('status')}:</span>
              <span
                className={`text-sm ${article.status === 'PUBLISHED' ? 'text-green-500' : 'text-yellow-500'}`}>
                {article.status}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-700">{t('created_at')}:</span>
              <span className="text-gray-600">{formatDateTime(article.created_at)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-700">{t('updated_at')}:</span>
              <span className="text-gray-600">{formatDateTime(article.updated_at)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-700">{t('published_at')}:</span>
              <span className="text-gray-600">
                {article.published_at ? formatDateTime(article.published_at) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-700">{t('author')}:</span>
              <span className="text-gray-600">{article.author}</span>
            </div>
            <div className="flex flex-col mt-4">
              <button
                onClick={() => toggleHighlight(article.id)}
                className="font-bold text-gray-700 mb-2 text-left focus:outline-none">
                {t('highlight')} {openArticleId === article.id ? '▲' : '▼'}
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

      <pre className="mt-6 mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
        {JSON.stringify(
          {
            queryParams: Object.fromEntries(searchParamsURL.entries()),
            localState: {
              selectedLocale,
              selectedCategories,
              searchInput
            }
          },
          null,
          2
        )}
      </pre>
    </div>
  )
}

export default ArticleSearchView
