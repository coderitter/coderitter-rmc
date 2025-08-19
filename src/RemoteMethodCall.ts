export interface RemoteMethodCall<ParametersType = any> {
    apiVersion?: number
    token?: string
    method: string
    parameters?: ParametersType
}