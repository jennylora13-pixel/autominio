import { useEffect, useState, type ReactNode } from 'react'

export default function TopBar({
  title,
  subtitle,
  left,
  right,
}: {
  title: ReactNode
  subtitle?: ReactNode
  left?: ReactNode
  right?: ReactNode
}) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={'topbar' + (scrolled ? ' scrolled' : '')}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
        {left}
        <div style={{ minWidth: 0 }}>
          <h1>{title}</h1>
          {subtitle && <div className="sub">{subtitle}</div>}
        </div>
      </div>
      {right && <div style={{ display: 'flex', gap: 6 }}>{right}</div>}
    </header>
  )
}
