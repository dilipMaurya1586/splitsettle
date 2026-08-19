import React, { useState } from 'react'
import Avatar from './Avatar'
import { formatCurrency } from '../utils/format'

export default function SettlementCard({ transaction, onSettle }) {
  const [settling, setSettling] = useState(false)
  const isSettled = transaction.status === 'SETTLED' || transaction.settled

  const fromLabel = String(transaction.fromName || transaction.from || transaction.fromUserId || '?')
  const toLabel = String(transaction.toName || transaction.to || transaction.toUserId || '?')

  async function handleSettle() {
    setSettling(true)
    try {
      await onSettle?.(transaction)
    } finally {
      setSettling(false)
    }
  }

  return (
    <div className={`card p-4 flex items-center gap-4 ${isSettled ? 'opacity-60' : ''}`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar name={fromLabel} />
        <div className="flex flex-col items-center px-1">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">owes</span>
          <span className="text-teal-500 text-lg leading-none">→</span>
        </div>
        <Avatar name={toLabel} />

        <div className="min-w-0 ml-1">
          <p className="text-sm font-medium text-ink-900 truncate">
            {fromLabel} <span className="text-ink-400 font-normal">owes</span> {toLabel}
          </p>
          <p className="amount font-semibold text-ink-900">{formatCurrency(transaction.amount)}</p>
        </div>
      </div>

      {isSettled ? (
        <span className="pill-settled">✓ paid</span>
      ) : (
        <button onClick={handleSettle} disabled={settling} className="btn-amber shrink-0">
          {settling ? 'Marking…' : 'Mark paid'}
        </button>
      )}
    </div>
  )
}



// import React, { useState } from 'react'
// import Avatar from './Avatar'
// import { formatCurrency } from '../utils/format'

// export default function SettlementCard({ transaction, onSettle }) {
//   const [settling, setSettling] = useState(false)
//   const isSettled = transaction.status === 'SETTLED' || transaction.settled

//   async function handleSettle() {
//     setSettling(true)
//     try {
//       await onSettle?.(transaction)
//     } finally {
//       setSettling(false)
//     }
//   }

//   return (
//     <div className={`card p-4 flex items-center gap-4 ${isSettled ? 'opacity-60' : ''}`}>
//       <div className="flex items-center gap-3 flex-1 min-w-0">
//         <Avatar name={transaction.fromName || transaction.from} />
//         <div className="flex flex-col items-center px-1">
//           <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">owes</span>
//           <span className="text-teal-500 text-lg leading-none">→</span>
//         </div>
//         <Avatar name={transaction.toName || transaction.to} />

//         <div className="min-w-0 ml-1">
//           <p className="text-sm font-medium text-ink-900 truncate">
//             {transaction.fromName || transaction.from}{' '}
//             <span className="text-ink-400 font-normal">owes</span>{' '}
//             {transaction.toName || transaction.to}
//           </p>
//           <p className="amount font-semibold text-ink-900">{formatCurrency(transaction.amount)}</p>
//         </div>
//       </div>

//       {isSettled ? (
//         <span className="pill-settled">✓ paid</span>
//       ) : (
//         <button onClick={handleSettle} disabled={settling} className="btn-amber shrink-0">
//           {settling ? 'Marking…' : 'Mark paid'}
//         </button>
//       )}
//     </div>
//   )
// }
