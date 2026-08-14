import React from 'react'

export default function EmptyState({ icon = '✦', title, description, action }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl2 bg-teal-50 text-2xl text-teal-500">
        {icon}
      </div>
      <div>
        <p className="font-display font-semibold text-ink-900">{title}</p>
        {description && <p className="mt-1 max-w-sm text-sm text-ink-400">{description}</p>}
      </div>
      {action}
    </div>
  )
}
