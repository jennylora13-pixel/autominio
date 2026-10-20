import { useEffect } from 'react'
import { HashRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import TabBar from './components/TabBar'
import Pray from './pages/Pray'
import Declare from './pages/Declare'
import Journal from './pages/Journal'
import Settings from './pages/Settings'
import Onboarding from './pages/Onboarding'
import Paywall from './components/Paywall'
import { useStore } from './store'
import { listenReminderTaps, scheduleReminders } from './lib/notifications'
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
      <Paywall />
    </div>
  )
}

listenReminderTaps()

export default function App() {
  const theme = useTheme()
  const { data } = useStore()
  const { profile } = data
  const { reminders } = data.settings

  // keep the next weeks of reminders scheduled (and ask permission right after the questionnaire)
  const justFinished = !!profile && Date.now() - profile.completedAt < 60_000
  useEffect(() => {
    if (profile) void scheduleReminders(profile, reminders, justFinished)
  }, [profile, reminders, justFinished])

  if (!data.profile) return <Onboarding />
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
