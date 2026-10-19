import { NavLink } from 'react-router-dom'
import { IconGear, IconNotes, IconPray, IconSun } from './icons'

const tabs = [
  { to: '/', label: 'Orar', Icon: IconPray, end: true },
  { to: '/declarar', label: 'Declarar', Icon: IconSun, end: false },
  { to: '/diario', label: 'Diário', Icon: IconNotes, end: false },
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
