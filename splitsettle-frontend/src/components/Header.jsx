import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'

export default function Header({ title, subtitle, actions }) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <header className="flex items-center justify-between gap-4 px-6 md:px-10 py-6 md:py-8">
      <div>
        {subtitle && <p className="eyebrow mb-1">{subtitle}</p>}
        <h1 className="font-display text-2xl md:text-3xl font-bold text-ink-900 tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {actions}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-ink-50 transition-colors"
          >
            <Avatar name={user?.name || user?.email || 'You'} />
            <span className="hidden sm:block text-sm font-semibold text-ink-900">
              {user?.name || 'Account'}
            </span>
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-48 card p-1.5 z-30">
              <div className="px-3 py-2 border-b border-ink-50 mb-1">
                <p className="text-sm font-semibold text-ink-900 truncate">{user?.name}</p>
                <p className="text-xs text-ink-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-coral-600 hover:bg-coral-50 transition-colors"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
