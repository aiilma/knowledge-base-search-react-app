import api from './api.ts'
import type { InstanceResponse } from '../types/instance.ts'
import type { ApiResponse } from '../types/api.ts'

// Запрос для получения параметров инстанса
export const getInstance = async () => {
  const response = await api.get<ApiResponse<InstanceResponse>>('/instance/')
  return response.data as InstanceResponse
}
