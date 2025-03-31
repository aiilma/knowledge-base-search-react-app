import api from './api.ts'
import type { ApiResponse } from '../types/api.ts'
import type { InstanceResponse } from '../types/instance.ts'

// Запрос для получения параметров инстанса
export const getInstance = async (): Promise<InstanceResponse> => {
  try {
    const response = await api.get<ApiResponse<InstanceResponse>>('/instance/')

    if ('detail' in response.data) {
      throw new Error(response.data.detail)
    }

    return response.data as InstanceResponse
  } catch (error) {
    console.error('Error fetching articles:', error)
    throw error
  }
}
