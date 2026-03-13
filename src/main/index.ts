import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

const CUSTOM_PROTOCOL = 'my-ai-chat'
const GOOGLE_CLIENT_ID = import.meta.env.MAIN_VITE_GOOGLE_CLIENT_ID
const MOCK_LOGIN_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${CUSTOM_PROTOCOL}%3A%2F%2Fauth&response_type=token&scope=openid+email+profile`

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 720,
    minWidth: 600,
    minHeight: 500,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// ---------------------------------------------------------------------------
// Custom protocol registration for deep linking (my-ai-chat://)
// ---------------------------------------------------------------------------
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(CUSTOM_PROTOCOL, process.execPath, [
      join(process.argv[1])
    ])
  }
} else {
  app.setAsDefaultProtocolClient(CUSTOM_PROTOCOL)
}

// macOS: handle deep link via open-url event
app.on('open-url', (_event, url) => {
  handleDeepLink(url)
})

// Windows / Linux: handle deep link via second-instance
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (_event, commandLine) => {
    // The deep link URL is the last argument
    const url = commandLine.find((arg) => arg.startsWith(`${CUSTOM_PROTOCOL}://`))
    if (url) handleDeepLink(url)

    // Focus the main window if it exists
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

function handleDeepLink(url: string): void {
  // Extract the token from the deep link URL
  // Expected format: my-ai-chat://auth#access_token=XXXXX&token_type=Bearer...
  // Or mock format:  my-ai-chat://auth?token=XXXXX
  let token: string | null = null

  try {
    const urlObj = new URL(url)
    // Try hash fragment first (standard OAuth implicit flow)
    const hashParams = new URLSearchParams(urlObj.hash.replace('#', ''))
    token = hashParams.get('access_token')

    // Fallback: try query params
    if (!token) {
      token = urlObj.searchParams.get('token')
    }
  } catch {
    console.error('Failed to parse deep link URL:', url)
  }

  if (token && mainWindow) {
    mainWindow.webContents.send('auth-token', token)
  }
}

// ---------------------------------------------------------------------------
// Mock AI handler — simulates a Google Gemini API call
// ---------------------------------------------------------------------------
async function mockGeminiAPI(message: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses = [
        `That's an interesting question about "${message}". Based on my analysis, I'd suggest considering multiple perspectives before reaching a conclusion.`,
        `Great question! Here's what I think about "${message}": The key insight is to break the problem down into smaller, manageable parts.`,
        `I've processed your request: "${message}". From a technical standpoint, there are several approaches you could take. Let me outline the most effective one.`,
        `Regarding "${message}" — this is a topic I find fascinating. The latest research suggests a nuanced approach works best.`,
        `Thanks for asking about "${message}". Let me share my thoughts: the most important thing is to start with a clear understanding of your goals.`
      ]
      resolve(responses[Math.floor(Math.random() * responses.length)])
    }, 1500)
  })
}

// ---------------------------------------------------------------------------
// IPC Handlers
// ---------------------------------------------------------------------------
function registerIpcHandlers(): void {
  // Google OAuth: open system browser to the mock login URL
  ipcMain.handle('start-google-login', async () => {
    await shell.openExternal(MOCK_LOGIN_URL)
    return { success: true }
  })

  // Chat with AI — mock Gemini API
  ipcMain.handle('chat-with-ai', async (_event, message: string) => {
    try {
      const response = await mockGeminiAPI(message)
      return { success: true, response }
    } catch (error) {
      return { success: false, error: String(error) }
    }
  })
}

// ---------------------------------------------------------------------------
// App lifecycle
// ---------------------------------------------------------------------------
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
