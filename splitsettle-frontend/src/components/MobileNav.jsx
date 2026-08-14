import React from 'react'
import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '⌂', end: true },
  { to: '/groups', label: 'Groups', icon: '⬡' },
  { to: '/settlements', label: 'Settle', icon: '⇄' },
]

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-ink-900 text-white flex justify-around px-2 py-2 border-t border-white/10">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg text-[11px] font-medium ${
              isActive ? 'text-amber-400' : 'text-ink-100/60'
            }`
          }
        >
          <span className="text-lg leading-none">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
