export type ServerResponse<T> = {
  message: string
  success: boolean
  data: T
}
