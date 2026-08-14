import React, { useState } from 'react'
import expenseService from '../services/expenseService'

export default function ExpenseForm({ groupId, members = [], onSubmit, onCancel, submitting }) {
  const [mode, setMode] = useState('manual')
  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(null)

  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(members[0]?.email || '')
  const [splitBetween, setSplitBetween] = useState(members.map((m) => m.email))

  function toggleSplit(email) {
    setSplitBetween((prev) => (prev.includes(email) ? prev.filter((x) => x !== email) : [...prev, email]))
  }

  async function handleAiParse() {
    if (!aiText.trim()) return
    setAiLoading(true)
    setAiError(null)
    try {
      const parsed = await expenseService.parseExpenseText(aiText, groupId)
      if (parsed.description) setDescription(parsed.description)
      if (parsed.amount) setAmount(String(parsed.amount))
      if (parsed.paidBy) setPaidBy(parsed.paidBy)
      if (parsed.splitBetween) setSplitBetween(parsed.splitBetween)
      setMode('manual')
    } catch (err) {
      setAiError(err.response?.data?.message || 'Could not parse that. Try the manual form instead.')
    } finally {
      setAiLoading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()

    const paidByMember = members.find(m => m.email === paidBy)
    const participantIds = members
      .filter(m => splitBetween.includes(m.email))
      .map(m => m.userId)  // ✅ CHANGE: id → userId

    onSubmit({
      groupId: parseInt(groupId),
      description: description.trim(),
      amount: Number(amount),
      splitType: 'EQUAL',
      paidByUserId: paidByMember?.userId,  // ✅ CHANGE: id → userId
      participantUserIds: participantIds,
    })
  }

  return (
    <div>
      <div className="flex gap-1 p-1 bg-ink-50 rounded-lg mb-5">
        <button
          type="button"
          onClick={() => setMode('manual')}
          className={`flex-1 rounded-md py-1.5 text-sm font-semibold transition-colors ${
            mode === 'manual' ? 'bg-white shadow-sm text-ink-900' : 'text-ink-400'
          }`}
        >
          Manual
        </button>
        <button
          type="button"
          onClick={() => setMode('ai')}
          className={`flex-1 rounded-md py-1.5 text-sm font-semibold transition-colors ${
            mode === 'ai' ? 'bg-white shadow-sm text-ink-900' : 'text-ink-400'
          }`}
        >
          ✨ Describe it
        </button>
      </div>

      {mode === 'ai' ? (
        <div className="space-y-3">
          <div>
            <label className="label">What happened?</label>
            <textarea
              className="input min-h-[90px] resize-none"
              placeholder='e.g. "I paid 500 for dinner with Ravi and Sam"'
              value={aiText}
              onChange={(e) => setAiText(e.target.value)}
            />
          </div>
          {aiError && <p className="text-sm text-coral-600">{aiError}</p>}
          <button type="button" onClick={handleAiParse} disabled={aiLoading} className="btn-primary w-full">
            {aiLoading ? 'Parsing…' : 'Parse expense'}
          </button>
          <p className="text-xs text-ink-400 text-center">
            We'll fill the form below — you can review before saving.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Description</label>
            <input
              className="input"
              placeholder="Dinner at Truffles"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 font-mono text-sm">₹</span>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input pl-7 amount"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Paid by</label>
            <select className="input" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
              {members.map((m) => (
                <option key={m.email} value={m.email}>
                  {m.name || m.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Split between</label>
            <div className="flex flex-wrap gap-2">
              {members.map((m) => {
                const active = splitBetween.includes(m.email)
                return (
                  <button
                    type="button"
                    key={m.email}
                    onClick={() => toggleSplit(m.email)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      active
                        ? 'bg-teal-500 border-teal-500 text-white'
                        : 'bg-white border-ink-100 text-ink-400 hover:border-teal-200'
                    }`}
                  >
                    {m.name || m.email}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting || !splitBetween.length} className="btn-primary">
              {submitting ? 'Saving…' : 'Save expense'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}




// import React, { useState } from 'react'
// import expenseService from '../services/expenseService'

// export default function ExpenseForm({ groupId, members = [], onSubmit, onCancel, submitting }) {
//   const [mode, setMode] = useState('manual') // 'manual' | 'ai'
//   const [aiText, setAiText] = useState('')
//   const [aiLoading, setAiLoading] = useState(false)
//   const [aiError, setAiError] = useState(null)

//   const [description, setDescription] = useState('')
//   const [amount, setAmount] = useState('')
//   const [paidBy, setPaidBy] = useState(members[0]?.id || '')
//   const [splitBetween, setSplitBetween] = useState(members.map((m) => m.id))

//   function toggleSplit(id) {
//     setSplitBetween((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
//   }

//   async function handleAiParse() {
//     if (!aiText.trim()) return
//     setAiLoading(true)
//     setAiError(null)
//     try {
//       const parsed = await expenseService.parseExpenseText(aiText, groupId)
//       if (parsed.description) setDescription(parsed.description)
//       if (parsed.amount) setAmount(String(parsed.amount))
//       if (parsed.paidBy) setPaidBy(parsed.paidBy)
//       if (parsed.splitBetween) setSplitBetween(parsed.splitBetween)
//       setMode('manual')
//     } catch (err) {
//       setAiError(err.response?.data?.message || 'Could not parse that. Try the manual form instead.')
//     } finally {
//       setAiLoading(false)
//     }
//   }

//   function handleSubmit(e) {
//     e.preventDefault()

//     const paidByMember = members.find(m => m.email === paidBy)
//     const participantIds = members
//       .filter(m => splitBetween.includes(m.email))
//       .map(m => m.userId)  // ✅ CHANGE: id → userId

//     onSubmit({
//       groupId: parseInt(groupId),
//       description: description.trim(),
//       amount: Number(amount),
//       splitType: 'EQUAL',
//       paidByUserId: paidByMember?.userId,  // ✅ CHANGE: id → userId
//       participantUserIds: participantIds,
//     })
//   }
//   // function handleSubmit(e) {
//   //   e.preventDefault()
//   //   onSubmit({
//   //     groupId,
//   //     description: description.trim(),
//   //     amount: Number(amount),
//   //     paidBy,
//   //     splitBetween,
//   //   })
//   // }

//   return (
//     <div>
//       <div className="flex gap-1 p-1 bg-ink-50 rounded-lg mb-5">
//         <button
//           type="button"
//           onClick={() => setMode('manual')}
//           className={`flex-1 rounded-md py-1.5 text-sm font-semibold transition-colors ${mode === 'manual' ? 'bg-white shadow-sm text-ink-900' : 'text-ink-400'
//             }`}
//         >
//           Manual
//         </button>
//         <button
//           type="button"
//           onClick={() => setMode('ai')}
//           className={`flex-1 rounded-md py-1.5 text-sm font-semibold transition-colors ${mode === 'ai' ? 'bg-white shadow-sm text-ink-900' : 'text-ink-400'
//             }`}
//         >
//           ✨ Describe it
//         </button>
//       </div>

//       {mode === 'ai' ? (
//         <div className="space-y-3">
//           <div>
//             <label className="label">What happened?</label>
//             <textarea
//               className="input min-h-[90px] resize-none"
//               placeholder='e.g. "I paid 500 for dinner with Ravi and Sam"'
//               value={aiText}
//               onChange={(e) => setAiText(e.target.value)}
//             />
//           </div>
//           {aiError && <p className="text-sm text-coral-600">{aiError}</p>}
//           <button type="button" onClick={handleAiParse} disabled={aiLoading} className="btn-primary w-full">
//             {aiLoading ? 'Parsing…' : 'Parse expense'}
//           </button>
//           <p className="text-xs text-ink-400 text-center">
//             We'll fill the form below — you can review before saving.
//           </p>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="label">Description</label>
//             <input
//               className="input"
//               placeholder="Dinner at Truffles"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="label">Amount</label>
//             <div className="relative">
//               <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 font-mono text-sm">₹</span>
//               <input
//                 type="number"
//                 min="0"
//                 step="0.01"
//                 className="input pl-7 amount"
//                 placeholder="0.00"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="label">Paid by</label>
//             <select className="input" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
//               {members.map((m) => (
//                 <option key={m.id} value={m.id}>
//                   {m.name || m.email}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="label">Split between</label>
//             <div className="flex flex-wrap gap-2">
//               {members.map((m) => {
//                 const active = splitBetween.includes(m.id)
//                 return (
//                   <button
//                     type="button"
//                     key={m.id}
//                     onClick={() => toggleSplit(m.id)}
//                     className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${active
//                         ? 'bg-teal-500 border-teal-500 text-white'
//                         : 'bg-white border-ink-100 text-ink-400 hover:border-teal-200'
//                       }`}
//                   >
//                     {m.name || m.email}
//                   </button>
//                 )
//               })}
//             </div>
//           </div>

//           <div className="flex justify-end gap-2 pt-2">
//             <button type="button" onClick={onCancel} className="btn-secondary">
//               Cancel
//             </button>
//             <button type="submit" disabled={submitting || !splitBetween.length} className="btn-primary">
//               {submitting ? 'Saving…' : 'Save expense'}
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   )
// }
