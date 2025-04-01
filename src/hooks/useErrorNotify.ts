import { useEffect } from 'react'
import { toast } from 'react-toastify'

export const useErrorNotify = (errors: any[]) => {
    useEffect(() => {
        errors.forEach((error) => {
            if (error) {
                toast.error(error.message || 'Ошибка загрузки данных')
            }
        })
    }, [errors])
}