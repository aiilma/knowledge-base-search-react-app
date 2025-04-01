export interface ErrorResponse {
  detail: string
  source: { [key: string]: unknown }
}

export type ApiResponse<T> = T | ErrorResponse
