export interface ChatResponse {
  success: boolean
  response?: string
  error?: string
}

export interface LoginResponse {
  success: boolean
}

export interface ElectronAPI {
  startGoogleLogin: () => Promise<LoginResponse>
  chatWithAI: (message: string) => Promise<ChatResponse>
  onAuthToken: (callback: (token: string) => void) => () => void
}

declare global {
  interface Window {
    api: ElectronAPI
  }
}
