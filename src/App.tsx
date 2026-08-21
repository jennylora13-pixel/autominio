import { useEffect } from 'react'
import {
  HashRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import TabBar from './components/TabBar'
import Home from './pages/Home'
import Verses from './pages/Verses'
import Prayers from './pages/Prayers'
import Settings from './pages/Settings'
import NoteEditor from './pages/NoteEditor'
import NoteDetail from './pages/NoteDetail'
import { useTheme } from './lib/useTheme'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

type ThemeCtx = ReturnType<typeof useTheme>

function MainLayout({ theme }: { theme: ThemeCtx }) {
  return (
    <div className="app">
      <Outlet context={theme} />
      <TabBar />
    </div>
  )
}

function FullLayout() {
  return (
    <div className="app">
      <Outlet />
    </div>
  )
}

export default function App() {
  const theme = useTheme()
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout theme={theme} />}>
          <Route path="/" element={<Home />} />
          <Route path="/versiculos" element={<Verses />} />
          <Route path="/oracoes" element={<Prayers />} />
          <Route path="/ajustes" element={<Settings />} />
        </Route>
        <Route element={<FullLayout />}>
          <Route path="/nota/nova" element={<NoteEditor />} />
          <Route path="/nota/:id" element={<NoteDetail />} />
          <Route path="/nota/:id/editar" element={<NoteEditor />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
