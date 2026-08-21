import { NavLink } from 'react-router-dom'
import { IconBook, IconGear, IconNotes, IconPray } from './icons'

const tabs = [
  { to: '/', label: 'Notas', Icon: IconNotes, end: true },
  { to: '/versiculos', label: 'Versículos', Icon: IconBook, end: false },
  { to: '/oracoes', label: 'Orações', Icon: IconPray, end: false },
  { to: '/ajustes', label: 'Ajustes', Icon: IconGear, end: false },
]

export default function TabBar() {
  return (
    <nav className="tabbar">
      <div className="inner">
        {tabs.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => 'tab' + (isActive ? ' active' : '')}
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
