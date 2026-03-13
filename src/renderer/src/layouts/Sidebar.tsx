import { useState } from 'react'

interface SidebarProps {
  onLogout: () => void
}

interface Conversation {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

export default function Sidebar({ onLogout }: SidebarProps): React.JSX.Element {
  const [conversations] = useState<Conversation[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={`flex h-screen flex-col border-r border-gray-800 bg-gray-900 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
    >
      {/* Sidebar Header — pt-8 clears macOS traffic-light buttons (hiddenInset titlebar) */}
      <div className="flex items-center justify-between border-b border-gray-800 px-4 pt-8 pb-3" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
              CLN
            </div>
            <h1 className="text-base font-semibold text-white">Chat App</h1>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isCollapsed ? (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            ) : (
              <>
                <polyline points="15 18 9 12 15 6" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-3 py-3">
        <button
          className={`flex w-full cursor-pointer items-center gap-2 rounded-lg border border-gray-700 px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-white ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <svg
            className="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {!isCollapsed && <span>New chat</span>}
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3">
        {conversations.length === 0 && !isCollapsed && (
          <p className="mt-4 text-center text-xs text-gray-600">No conversations yet</p>
        )}
        {conversations.map((conv) => (
          <button
            key={conv.id}
            className="mb-1 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-gray-800"
          >
            <svg
              className="h-4 w-4 shrink-0 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {!isCollapsed && (
              <span className="truncate">{conv.title}</span>
            )}
          </button>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-gray-800 px-3 py-3">
        <button
          onClick={onLogout}
          className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <svg
            className="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {!isCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  )
}
