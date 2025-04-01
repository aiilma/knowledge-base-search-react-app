import type { Id, Nullable } from './basic.ts'
import type { Category } from './categories.ts'
import type { Locale } from './instance.ts'

export enum ArticleStatus {
  DRAFT = 'DRAFT',
  UNAPPROVED = 'UNAPPROVED',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export interface SearchArticlesParams {
  search: string // поиск фразы ведётся в заголовке и теле, также можно искать по ID статьи
  category?: Category['id'][] // список ID разделов базы знаний
  locale?: Locale // использовать только указанную локализацию для полнотекстового поиска
  status?: ArticleStatus[] // список статусов статей
  cursor?: string // строковое значение, берётся из поля next или previous предыдущих запросов
}

export interface Article {
  id: Id
  ext_id: Nullable<Id>
  rank: number
  status: ArticleStatus
  highlight: { [key: string]: string }
  // public_urls: string // fixme в схеме, как string, а для статьи с id 31 - объект
  created_at: string
  updated_at: string
  published_at: Nullable<string>
  author: string
}

export interface SearchArticlesResponse {
  next: Nullable<string>
  previous: Nullable<string>
  results: Article[]
}
