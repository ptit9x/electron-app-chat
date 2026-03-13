import Sidebar from '../components/Sidebar'
import ChatScreen from '../components/ChatScreen'

interface MainLayoutProps {
  onLogout: () => void
}

export default function MainLayout({ onLogout }: MainLayoutProps): React.JSX.Element {
  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 overflow-hidden">
        <ChatScreen />
      </main>
    </div>
  )
}
