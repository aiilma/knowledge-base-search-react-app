import { useEffect } from 'react'
import { toast } from 'react-toastify'

import { Nullable } from '../types/basic.ts'

export const useErrorNotify = (errors: Nullable<Error>[]) => {
  useEffect(() => {
    errors.forEach((error) => {
      if (error) {
        toast.error(error.message || 'Ошибка загрузки данных')
      }
    })
  }, [errors])
}
