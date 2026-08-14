import React from 'react'
import { formatCurrency } from '../utils/format'

// amount > 0  => this person is owed money (moss/green)
// amount < 0  => this person owes money (coral/red)
// amount === 0 => settled up
export default function BalancePill({ amount }) {
  const value = Number(amount) || 0
  if (value === 0) {
    return <span className="pill-settled">settled up</span>
  }
  if (value > 0) {
    return <span className="pill-owed">+{formatCurrency(value)}</span>
  }
  return <span className="pill-owe">{formatCurrency(value)}</span>
}
