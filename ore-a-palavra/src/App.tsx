import { useEffect } from 'react'
import { HashRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import TabBar from './components/TabBar'
import Pray from './pages/Pray'
import Declare from './pages/Declare'
import Journal from './pages/Journal'
import Settings from './pages/Settings'
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

export default function App() {
  const theme = useTheme()
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout theme={theme} />}>
          <Route path="/" element={<Pray />} />
          <Route path="/declarar" element={<Declare />} />
          <Route path="/diario" element={<Journal />} />
          <Route path="/ajustes" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
