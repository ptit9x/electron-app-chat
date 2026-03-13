import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
}

export default function ChatScreen(): React.JSX.Element {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = async (): Promise<void> => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      if (!window.api) throw new Error('Electron API not available')
      const result = await window.api.chatWithAI(trimmed)
      if (result.success && result.response) {
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: 'ai',
          content: result.response,
          timestamp: new Date()
        }
        setMessages((prev) => [...prev, aiMessage])
      } else {
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: 'ai',
          content: 'Sorry, something went wrong. Please try again.',
          timestamp: new Date()
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: 'Failed to connect to the AI service. Please try again later.',
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full flex-col bg-gray-950">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-gray-500">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800 text-3xl">
              💬
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-gray-300">How can I help you today?</p>
              <p className="mt-1 text-sm text-gray-500">Start a conversation with the AI assistant</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl px-4 py-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-6 flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'ai' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-purple-600 text-xs font-bold text-white">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-200'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-700 text-xs font-bold text-gray-300">
                    You
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="mb-6 flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-purple-600 text-xs font-bold text-white">
                  AI
                </div>
                <div className="rounded-2xl bg-gray-800 px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-gray-800 bg-gray-900 px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex h-[44px] w-[44px] shrink-0 cursor-pointer items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-gray-600">
          AI responses are simulated. Press Enter to send, Shift+Enter for new line.
        </p>
      </div>
    </div>
  )
}
