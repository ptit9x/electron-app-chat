import { useState } from 'react'
import LoginScreen from './components/LoginScreen'
import MainLayout from './layouts/MainLayout'

function App(): React.JSX.Element {
  const [token, setToken] = useState<string | null>(null)

  const handleLogin = (receivedToken: string): void => {
    setToken(receivedToken)
  }

  const handleLogout = (): void => {
    setToken(null)
  }

  if (!token) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return <MainLayout onLogout={handleLogout} />
}

export default App
