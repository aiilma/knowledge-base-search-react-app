import React, {useCallback, useState} from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'

import {useLocalStorage} from "../hooks/useLocalStorage.ts";
import type { Article } from '../types/articles'
import type { Id, Nullable } from '../types/basic.ts'

const renderers = {
  img: ({ src }: { alt?: string; src?: string }) => (
    <a href={src} target="_blank" rel="noopener noreferrer" className="text-blue-500 block">
      Изображение
    </a>
  )
}

interface ArticleListProps {
  data: Article[] | undefined
  isLoading: boolean
  articlesError: any
}

const ArticleList: React.FC<ArticleListProps> = ({
  data,
  isLoading,
  articlesError,
}) => {
  const { t, i18n } = useTranslation()
  const [viewedArticles, setViewedArticles] = useLocalStorage<Id[]>('viewedArticles', [])
  const [openArticleId, setOpenArticleId] = useState<Nullable<Article['id']>>(null)

  const formatDateTime = useCallback(
    (dateStringValue: string) => {
      return new Date(dateStringValue).toLocaleString(i18n.language, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    [i18n.language]
  )

  const toggleHighlight = (id: Id) => {
    setOpenArticleId(openArticleId === id ? null : id)
    if (!viewedArticles.includes(id)) {
      setViewedArticles([...viewedArticles, id])
    }
  }

  if (isLoading) return <p className="text-blue-500 text-center">{t('loading')}</p>
  if (articlesError) return <p className="text-red-500 text-center">{t('error_loading')}</p>
  if (!data?.length) return <p className="text-gray-500 text-center">{t('no_data')}</p>

  return (
    <ul className="space-y-6">
      {data?.map((article: Article) => (
        <li
          key={article.id}
          className={`p-6 border border-gray-300 rounded-lg shadow-lg transition-colors duration-300 ${viewedArticles.includes(article.id) ? 'bg-blue-100' : 'bg-white'}`}>
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
              className={`font-bold mb-2 text-left focus:outline-none px-4 py-2 rounded-lg transition-colors duration-300 cursor-pointer ${openArticleId === article.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-400 hover:text-white active:bg-blue-600 active:text-white`}>
              {openArticleId === article.id ? t('highlight.hide') : t('highlight.open')}{' '}
              {openArticleId === article.id ? '▲' : '▼'}
            </button>
            <div
              className={`transition-max-height duration-500 ease-in-out overflow-auto ${openArticleId === article.id ? 'max-h-screen py-4' : 'max-h-0'} px-2 bg-gray-800 text-white rounded-lg`}>
              <ul className="list-disc list-inside text-gray-300">
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
  )
}

export default ArticleList
