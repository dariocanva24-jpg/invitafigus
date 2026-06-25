import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import HomePage from './pages/HomePage'
import InvitationPage from './pages/InvitationPage'
import CreatePage from './pages/CreatePage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/invitacion/:slug" element={<InvitationPage />} />
        <Route path="/crear" element={<CreatePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </AppProvider>
  )
}

export default App