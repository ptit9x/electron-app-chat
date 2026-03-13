import { useState, type FormEvent } from 'react'

interface LoginScreenProps {
  onLogin: (token: string) => void
}

const MOCK_EMAIL = 'richard@gmail.com'
const MOCK_PASSWORD = 'abcd1234'

export default function LoginScreen({ onLogin }: LoginScreenProps): React.JSX.Element {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate async login
    setTimeout(() => {
      if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
        onLogin('mock-token-' + Date.now())
      } else {
        setError('Invalid email or password')
      }
      setLoading(false)
    }, 600)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <div className="flex w-full max-w-md flex-col items-center gap-8 rounded-2xl border border-gray-800 bg-gray-900 p-10 shadow-2xl">
        {/* Logo / Branding */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 text-3xl font-bold text-white shadow-lg">
            AI
          </div>
          <h1 className="text-2xl font-bold text-white">AI Chat App</h1>
          <p className="text-center text-sm text-gray-400">
            Sign in to start chatting with your AI assistant
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-center text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            <span>{loading ? 'Signing in...' : 'Sign in'}</span>
          </button>
        </form>
      </div>
    </div>
  )
}
