import React from 'react'
import Avatar from './Avatar'
import { formatCurrency, formatDate } from '../utils/format'

export default function ExpenseItem({ expense, onEdit, onDelete }) {
  return (
    <div className="group flex items-center gap-4 py-4 px-1 border-b border-ink-50 last:border-0">
      <Avatar name={expense.paidByName || expense.paidBy} />

      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink-900 truncate">{expense.description}</p>
        <p className="text-xs text-ink-400 mt-0.5">
          <span className="font-semibold text-ink-700">{expense.paidByName || expense.paidBy}</span> paid ·{' '}
          {formatDate(expense.date || expense.createdAt)}
        </p>
      </div>

      <div className="text-right">
        <p className="amount font-semibold text-ink-900">{formatCurrency(expense.amount)}</p>
        <p className="text-xs text-ink-400">split {expense.splitBetween?.length || 0} ways</p>
      </div>

      <div className="hidden group-hover:flex items-center gap-1 pl-2">
        <button
          onClick={() => onEdit?.(expense)}
          className="p-1.5 rounded-md text-ink-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
          aria-label="Edit expense"
          title="Edit"
        >
          ✎
        </button>
        <button
          onClick={() => onDelete?.(expense)}
          className="p-1.5 rounded-md text-ink-400 hover:text-coral-600 hover:bg-coral-50 transition-colors"
          aria-label="Delete expense"
          title="Delete"
        >
          🗑
        </button>
      </div>
    </div>
  )
}
