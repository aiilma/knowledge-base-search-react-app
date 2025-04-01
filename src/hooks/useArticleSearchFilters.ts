import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { MultiValue, SingleValue } from 'react-select'

import { useCategoriesQuery } from './useCategoriesQuery'
import { useErrorNotify } from './useErrorNotify'
import { useInstanceQuery } from './useInstanceQuery'
import { FilterConfig } from '../components/Filters'
import i18n from '../i18n'
import { Locale } from '../types/instance'

const localeLabels: { [key in Locale]: string } = {
  [Locale.RU]: 'Русский',
  [Locale.EN]: 'English'
}

const getLocaleLabel = (locale: Locale): string => {
  return localeLabels[locale] || 'Unknown'
}

export const useArticleSearchFilters = () => {
  const { t } = useTranslation()
  const [searchParamsURL, setSearchParamsURL] = useSearchParams()

  const [selectedLocale, setSelectedLocale] =
    useState<SingleValue<{ value: Locale; label: string }>>(null)
  const [selectedCategories, setSelectedCategories] = useState<
    MultiValue<{ value: number; label: string }>
  >([])

  const {
    data: instanceData,
    isLoading: instanceQueryLoading,
    error: instanceError
  } = useInstanceQuery(true)
  const {
    data: categoriesData,
    isLoading: categoriesQueryLoading,
    error: categoriesError
  } = useCategoriesQuery({}, true)

  useErrorNotify([instanceError, categoriesError])

  useEffect(() => {
    if (instanceData) {
      const queryLocale = searchParamsURL.get('locale') as Locale
      let lang

      if (queryLocale && instanceData.locales.includes(queryLocale)) {
        setSelectedLocale({
          value: queryLocale,
          label: getLocaleLabel(queryLocale)
        })
        lang = queryLocale
      } else {
        const defaultLocale = instanceData.default_locale as Locale
        setSelectedLocale({
          value: defaultLocale,
          label: getLocaleLabel(defaultLocale)
        })
        lang = defaultLocale
      }

      i18n.changeLanguage(lang)
    }
  }, [instanceData, searchParamsURL])

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

  const handleLocaleChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedLocale(selectedOption)
      setSearchParamsURL({
        ...Object.fromEntries(searchParamsURL.entries()),
        locale: selectedOption.value
      })
      i18n.changeLanguage(selectedOption.value)
    }
  }

  const handleCategoryChange = (selectedOptions) => {
    const selectedCategories = selectedOptions
      ? selectedOptions.map((option) => option.value).join(',')
      : ''
    setSelectedCategories(selectedOptions)
    setSearchParamsURL({
      ...Object.fromEntries(searchParamsURL.entries()),
      category: selectedCategories
    })
  }

  const filtersQueriesLoading = instanceQueryLoading || categoriesQueryLoading

  const filters: FilterConfig[] = [
    {
      type: 'inputselect',
      name: 'locale',
      options:
        instanceData?.locales.map((loc: Locale) => ({
          value: loc,
          label: getLocaleLabel(loc)
        })) || [],
      value: selectedLocale,
      onChange: handleLocaleChange,
      placeholder: instanceQueryLoading ? t('loading') : t('select_locale'),
      isLoading: instanceQueryLoading,
      isDisabled: filtersQueriesLoading
    },
    {
      type: 'multi-inputselect',
      name: 'categories',
      options:
        categoriesData?.results.map((category) => ({
          value: category.id,
          label: category.name[selectedLocale?.value as Locale]
        })) || [],
      value: selectedCategories,
      onChange: handleCategoryChange,
      placeholder: categoriesQueryLoading ? t('loading') : t('select_categories'),
      isLoading: categoriesQueryLoading,
      isDisabled: filtersQueriesLoading
    }
  ]

  return {
    filters,
    filtersQueriesLoading,
  }
}
