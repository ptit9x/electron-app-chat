import Sidebar from './Sidebar'
import Header from './Header'
import ChatScreen from '../components/ChatScreen'

interface MainLayoutProps {
  onLogout: () => void
}

export default function MainLayout({ onLogout }: MainLayoutProps): React.JSX.Element {
  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar onLogout={onLogout} />
      <main className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <ChatScreen />
      </main>
    </div>
  )
}
