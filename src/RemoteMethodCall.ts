export interface RemoteMethodCall<ParametersType = any> {
    apiVersion?: number
    apiKey?: string
    token?: string
    method: string
    parameters?: ParametersType
}