import React from 'react'
import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '⌂', end: true },
  { to: '/groups', label: 'Groups', icon: '⬡' },
  { to: '/settlements', label: 'Settlements', icon: '⇄' },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 shrink-0 bg-ink-900 text-white min-h-screen sticky top-0">
      <div className="px-6 py-7 flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center text-ink-900 font-display font-bold">
          S
        </div>
        <span className="font-display text-lg font-bold tracking-tight">SplitSettle</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-teal-700/60 text-white border-l-2 border-amber-500'
                  : 'text-ink-100/70 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
              }`
            }
          >
            <span className="text-base leading-none opacity-80">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-6 text-xs text-ink-100/40 font-mono">v1.0.0 · gateway :8080</div>
    </aside>
  )
}
