export interface ResponseData<T> {
  content: T[]
  total: number
  page: number
  size: number
}

export interface ApiResponse<T> {
  code: number
  data: ResponseData<T>
  message: string
}
