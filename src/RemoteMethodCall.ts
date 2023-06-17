export interface RemoteMethodCall {
  apiVersion?: number
  apiKey?: string
  token?: string
  method: string
  parameters?: any
}