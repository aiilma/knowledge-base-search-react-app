export enum Locale {
  EN = 'en',
  RU = 'ru'
}

export interface InstanceResponse {
  locales: Locale[]
  default_locale: Locale
  currency: string
}