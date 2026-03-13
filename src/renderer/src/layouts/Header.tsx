import { useState } from 'react'

export default function Header(): React.JSX.Element {
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
    <header className="flex shrink-0 items-center justify-end gap-2 border-b border-gray-800 bg-gray-900 px-4 pt-8 pb-3">
      {/* Share Conversation */}
      <button
        className="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
        onClick={() => {
          /* TODO: share logic */
        }}
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        <span>Share</span>
      </button>

      {/* Profile Avatar */}
      <div className="relative">
        <button
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-sm font-bold text-white transition-opacity hover:opacity-80"
          onClick={() => setShowProfileMenu((prev) => !prev)}
        >
          R
        </button>

        {showProfileMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-gray-700 bg-gray-800 py-1 shadow-xl">
            <button className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              My Profile
            </button>
            <button className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Settings
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
