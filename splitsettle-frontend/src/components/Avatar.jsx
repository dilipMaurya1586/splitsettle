import React from 'react'
import { initials, avatarColor } from '../utils/format'

export default function Avatar({ name = '?', size = 'md' }) {
  const sizes = {
    sm: 'w-7 h-7 text-[11px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
  }
  return (
    <div
      className={`${sizes[size]} shrink-0 rounded-full flex items-center justify-center font-display font-semibold text-white ring-2 ring-white`}
      style={{ backgroundColor: avatarColor(name) }}
      title={name}
    >
      {initials(name) || '?'}
    </div>
  )
}
