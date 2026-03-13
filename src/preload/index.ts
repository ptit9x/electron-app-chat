import { contextBridge, ipcRenderer } from 'electron'

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

const api: ElectronAPI = {
  startGoogleLogin: () => ipcRenderer.invoke('start-google-login'),

  chatWithAI: (message: string) => ipcRenderer.invoke('chat-with-ai', message),

  onAuthToken: (callback: (token: string) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, token: string): void => {
      callback(token)
    }
    ipcRenderer.on('auth-token', handler)
    // Return a cleanup function
    return (): void => {
      ipcRenderer.removeListener('auth-token', handler)
    }
  }
}

contextBridge.exposeInMainWorld('api', api)
