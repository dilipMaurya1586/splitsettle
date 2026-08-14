import React from 'react'

export default function StatCard({ label, value, tone = 'default', icon }) {
  const toneClasses = {
    default: 'text-ink-900',
    owed: 'text-moss-600',
    owe: 'text-coral-600',
    amber: 'text-amber-600',
  }
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className="h-11 w-11 rounded-xl bg-ink-50 flex items-center justify-center text-xl">{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</p>
        <p className={`amount text-xl font-bold mt-0.5 ${toneClasses[tone]}`}>{value}</p>
      </div>
    </div>
  )
}
