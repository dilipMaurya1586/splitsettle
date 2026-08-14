import React from 'react'

export default function Loader({ label = 'Loading…', full = false }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-ink-400 ${full ? 'min-h-[60vh]' : 'py-16'}`}>
      <span className="relative flex h-9 w-9">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-300 opacity-40" />
        <span className="relative inline-flex h-9 w-9 rounded-full bg-teal-500" />
      </span>
      <p className="text-sm font-medium">{label}</p>
    </div>
  )
}
