export interface ErrorResponse {
  detail: string
  source: { [key: string]: any }
}

export type ApiResponse<T> = T | ErrorResponse
