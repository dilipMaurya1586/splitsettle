import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import BalancePill from './BalancePill'

export default function GroupCard({ group }) {
  const members = group.members || []
  const visible = members.slice(0, 4)
  const overflow = members.length - visible.length

  return (
    <Link
      to={`/groups/${group.id}`}
      className="card p-5 flex flex-col gap-4 hover:shadow-pop hover:-translate-y-0.5 transition-all duration-150"
    >
      <div className="flex items-start justify-between">
        <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-display font-bold text-lg">
          {group.name?.[0]?.toUpperCase() || '#'}
        </div>
        {typeof group.balance !== 'undefined' && <BalancePill amount={group.balance} />}
      </div>

      <div>
        <h3 className="font-display font-semibold text-ink-900 leading-tight">{group.name}</h3>
        {group.description && (
          <p className="text-sm text-ink-400 mt-0.5 line-clamp-1">{group.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-ink-50">
        <div className="flex -space-x-2">
          {visible.map((m) => (
            <Avatar key={m.id || m.email} name={m.name || m.email} size="sm" />
          ))}
          {overflow > 0 && (
            <div className="w-7 h-7 rounded-full bg-ink-50 text-ink-400 text-[10px] font-semibold flex items-center justify-center ring-2 ring-white">
              +{overflow}
            </div>
          )}
        </div>
        <span className="text-xs font-medium text-ink-400">{members.length} member{members.length === 1 ? '' : 's'}</span>
      </div>
    </Link>
  )
}
