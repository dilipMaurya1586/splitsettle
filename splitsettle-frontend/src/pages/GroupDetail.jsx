import React, { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import Avatar from '../components/Avatar'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseItem from '../components/ExpenseItem'
import SettlementCard from '../components/SettlementCard'
import BalancePill from '../components/BalancePill'
import groupService from '../services/groupService'
import expenseService from '../services/expenseService'
import settlementService from '../services/settlementService'
import { formatCurrency } from '../utils/format'

const TABS = [
  { key: 'expenses', label: 'Expenses' },
  { key: 'settlements', label: 'Settlements' },
  { key: 'members', label: 'Members' },
]

export default function GroupDetail() {
  const { groupId } = useParams()
  const [tab, setTab] = useState('expenses')

  const [group, setGroup] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [balances, setBalances] = useState([])
  const [pending, setPending] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [expenseModalOpen, setExpenseModalOpen] = useState(false)
  const [submittingExpense, setSubmittingExpense] = useState(false)

  const [memberModalOpen, setMemberModalOpen] = useState(false)
  const [memberEmail, setMemberEmail] = useState('')
  const [addingMember, setAddingMember] = useState(false)
  const [memberError, setMemberError] = useState(null)

  const [calculating, setCalculating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [groupData, expenseData, balanceData, pendingData] = await Promise.all([
        groupService.getGroup(groupId),
        expenseService.getGroupExpenses(groupId),
        settlementService.getBalances(groupId).catch(() => []),
        settlementService.getPendingSettlements(groupId).catch(() => []),
      ])
      setGroup(groupData)
      setExpenses(Array.isArray(expenseData) ? expenseData : expenseData?.expenses || [])
      setBalances(Array.isArray(balanceData) ? balanceData : balanceData?.balances || [])
      setPending(Array.isArray(pendingData) ? pendingData : pendingData?.transactions || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load this group.')
    } finally {
      setLoading(false)
    }
  }, [groupId])

  useEffect(() => {
    load()
  }, [load])

  async function handleAddExpense(payload) {
    setSubmittingExpense(true)
    try {
      await expenseService.addExpense(payload)
      setExpenseModalOpen(false)
      load()
    } catch (err) {
      // surfaced inline via alert-style banner would be nicer; kept simple here
      alert(err.response?.data?.message || 'Could not save the expense.')
    } finally {
      setSubmittingExpense(false)
    }
  }

  async function handleDeleteExpense(expense) {
    if (!confirm(`Delete "${expense.description}"?`)) return
    try {
      await expenseService.deleteExpense(expense.id)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete this expense.')
    }
  }

  async function handleAddMember(e) {
    e.preventDefault()
    setAddingMember(true)
    setMemberError(null)
    try {
      // group-service needs userId + userEmail + userFullName, not just an
      // email — so resolve the account via user-service first.
      const foundUser = await groupService.lookupUserByEmail(memberEmail)
      await groupService.addMember(groupId, {
        userId: foundUser.id,
        userEmail: foundUser.email,
        userFullName: foundUser.fullName,
      })
      setMemberModalOpen(false)
      setMemberEmail('')
      load()
    } catch (err) {
      const status = err.response?.status
      const fallback =
        status === 404
          ? 'No SplitSettle account exists with this email. Ask them to register first.'
          : 'Could not add this member.'
      setMemberError(err.response?.data?.message || fallback)
    } finally {
      setAddingMember(false)
    }
  }

  async function handleCalculate() {
    setCalculating(true)
    try {
      await settlementService.calculateSettlements(groupId)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Could not calculate settlements.')
    } finally {
      setCalculating(false)
    }
  }

  async function handleSettle(transaction) {
    await settlementService.markSettled(transaction.id)
    load()
  }

  const members = group?.members || []

  return (
    <div>
      <Header
        subtitle={
          <Link to="/groups" className="hover:underline">
            ← Groups
          </Link>
        }
        title={loading ? 'Loading…' : group?.name || 'Group'}
        actions={
          tab === 'expenses' ? (
            <button className="btn-primary" onClick={() => setExpenseModalOpen(true)} disabled={loading}>
              + Add expense
            </button>
          ) : tab === 'members' ? (
            <button className="btn-primary" onClick={() => setMemberModalOpen(true)} disabled={loading}>
              + Add member
            </button>
          ) : (
            <button className="btn-amber" onClick={handleCalculate} disabled={calculating || loading}>
              {calculating ? 'Calculating…' : 'Recalculate'}
            </button>
          )
        }
      />

      <div className="px-6 md:px-10 pb-16">
        {loading ? (
          <Loader label="Loading group…" />
        ) : error ? (
          <EmptyState icon="⚠" title="Something went wrong" description={error} />
        ) : (
          <>
            {group?.description && <p className="text-sm text-ink-400 -mt-4 mb-6">{group.description}</p>}

            <div className="flex gap-1 p-1 bg-ink-50 rounded-lg mb-6 w-fit">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                    tab === t.key ? 'bg-white shadow-sm text-ink-900' : 'text-ink-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'expenses' &&
              (expenses.length === 0 ? (
                <EmptyState
                  icon="🧾"
                  title="No expenses yet"
                  description="Add the first expense for this group — it'll be split automatically."
                  action={
                    <button className="btn-primary" onClick={() => setExpenseModalOpen(true)}>
                      Add an expense
                    </button>
                  }
                />
              ) : (
                <div className="card px-5">
                  {expenses.map((e) => (
                    <ExpenseItem key={e.id} expense={e} onDelete={handleDeleteExpense} />
                  ))}
                </div>
              ))}

            {tab === 'settlements' && (
              <div className="space-y-6">
                {balances.length > 0 && (
                  <div className="card p-5">
                    <p className="font-display font-semibold text-ink-900 mb-4">Balances</p>
                    <div className="space-y-3">
                      {balances.map((b, idx) => (
                        <div key={b.userId || idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar name={b.name || b.userId} size="sm" />
                            <span className="text-sm font-medium text-ink-700">{b.name || b.userId}</span>
                          </div>
                          <BalancePill amount={b.balance ?? b.amount} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="font-display font-semibold text-ink-900 mb-4">Pending settlements</p>
                  {pending.length === 0 ? (
                    <EmptyState
                      icon="✓"
                      title="All settled up"
                      description="No pending payments in this group."
                    />
                  ) : (
                    <div className="space-y-3">
                      {pending.map((t, idx) => (
                        <SettlementCard key={t.id || idx} transaction={t} onSettle={handleSettle} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === 'members' &&
              (members.length === 0 ? (
                <EmptyState icon="👥" title="No members yet" description="Add people to start splitting expenses." />
              ) : (
                <div className="card divide-y divide-ink-50">
                  {members.map((m) => (
                    <div key={m.id || m.email} className="flex items-center gap-3 px-5 py-4">
                      <Avatar name={m.name || m.email} />
                      <div>
                        <p className="text-sm font-semibold text-ink-900">{m.name || m.email}</p>
                        {m.email && <p className="text-xs text-ink-400">{m.email}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </>
        )}
      </div>

      <Modal
        open={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        title="Add an expense"
      >
        <ExpenseForm
          groupId={groupId}
          members={members}
          submitting={submittingExpense}
          onSubmit={handleAddExpense}
          onCancel={() => setExpenseModalOpen(false)}
        />
      </Modal>

      <Modal open={memberModalOpen} onClose={() => setMemberModalOpen(false)} title="Add a member">
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="label">Email address</label>
            <input
              type="email"
              required
              className="input"
              placeholder="friend@example.com"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
            />
          </div>
          {memberError && (
            <div className="text-sm text-coral-600 bg-coral-50 rounded-lg px-3.5 py-2.5">{memberError}</div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setMemberModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" disabled={addingMember} className="btn-primary">
              {addingMember ? 'Adding…' : 'Add member'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}


// import React, { useEffect, useState, useCallback } from 'react'
// import { useParams, Link } from 'react-router-dom'
// import Header from '../components/Header'
// import Loader from '../components/Loader'
// import EmptyState from '../components/EmptyState'
// import Modal from '../components/Modal'
// import Avatar from '../components/Avatar'
// import ExpenseForm from '../components/ExpenseForm'
// import ExpenseItem from '../components/ExpenseItem'
// import SettlementCard from '../components/SettlementCard'
// import BalancePill from '../components/BalancePill'
// import groupService from '../services/groupService'
// import expenseService from '../services/expenseService'
// import settlementService from '../services/settlementService'
// import { formatCurrency } from '../utils/format'

// const TABS = [
//   { key: 'expenses', label: 'Expenses' },
//   { key: 'settlements', label: 'Settlements' },
//   { key: 'members', label: 'Members' },
// ]

// export default function GroupDetail() {
//   const { groupId } = useParams()
//   const [tab, setTab] = useState('expenses')

//   const [group, setGroup] = useState(null)
//   const [expenses, setExpenses] = useState([])
//   const [balances, setBalances] = useState([])
//   const [pending, setPending] = useState([])

//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const [expenseModalOpen, setExpenseModalOpen] = useState(false)
//   const [submittingExpense, setSubmittingExpense] = useState(false)

//   const [memberModalOpen, setMemberModalOpen] = useState(false)
//   const [memberEmail, setMemberEmail] = useState('')
//   const [addingMember, setAddingMember] = useState(false)
//   const [memberError, setMemberError] = useState(null)

//   const [calculating, setCalculating] = useState(false)

//   const load = useCallback(async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const [groupData, expenseData, balanceData, pendingData] = await Promise.all([
//         groupService.getGroup(groupId),
//         expenseService.getGroupExpenses(groupId),
//         settlementService.getBalances(groupId).catch(() => []),
//         settlementService.getPendingSettlements(groupId).catch(() => []),
//       ])
//       setGroup(groupData)
//       setExpenses(Array.isArray(expenseData) ? expenseData : expenseData?.expenses || [])
//       setBalances(Array.isArray(balanceData) ? balanceData : balanceData?.balances || [])
//       setPending(Array.isArray(pendingData) ? pendingData : pendingData?.transactions || [])
//     } catch (err) {
//       setError(err.response?.data?.message || 'Could not load this group.')
//     } finally {
//       setLoading(false)
//     }
//   }, [groupId])

//   useEffect(() => {
//     load()
//   }, [load])

//   async function handleAddExpense(payload) {
//     setSubmittingExpense(true)
//     try {
//       await expenseService.addExpense(payload)
//       setExpenseModalOpen(false)
//       load()
//     } catch (err) {
//       // surfaced inline via alert-style banner would be nicer; kept simple here
//       alert(err.response?.data?.message || 'Could not save the expense.')
//     } finally {
//       setSubmittingExpense(false)
//     }
//   }

//   async function handleDeleteExpense(expense) {
//     if (!confirm(`Delete "${expense.description}"?`)) return
//     try {
//       await expenseService.deleteExpense(expense.id)
//       load()
//     } catch (err) {
//       alert(err.response?.data?.message || 'Could not delete this expense.')
//     }
//   }

//   async function handleAddMember(e) {
//     e.preventDefault()
//     setAddingMember(true)
//     setMemberError(null)
//     try {
//       await groupService.addMember(groupId, { email: memberEmail })
//       setMemberModalOpen(false)
//       setMemberEmail('')
//       load()
//     } catch (err) {
//       setMemberError(err.response?.data?.message || 'Could not add this member.')
//     } finally {
//       setAddingMember(false)
//     }
//   }

//   async function handleCalculate() {
//     setCalculating(true)
//     try {
//       await settlementService.calculateSettlements(groupId)
//       load()
//     } catch (err) {
//       alert(err.response?.data?.message || 'Could not calculate settlements.')
//     } finally {
//       setCalculating(false)
//     }
//   }

//   async function handleSettle(transaction) {
//     await settlementService.markSettled(transaction.id)
//     load()
//   }

//   const members = group?.members || []

//   return (
//     <div>
//       <Header
//         subtitle={
//           <Link to="/groups" className="hover:underline">
//             ← Groups
//           </Link>
//         }
//         title={loading ? 'Loading…' : group?.name || 'Group'}
//         actions={
//           tab === 'expenses' ? (
//             <button className="btn-primary" onClick={() => setExpenseModalOpen(true)} disabled={loading}>
//               + Add expense
//             </button>
//           ) : tab === 'members' ? (
//             <button className="btn-primary" onClick={() => setMemberModalOpen(true)} disabled={loading}>
//               + Add member
//             </button>
//           ) : (
//             <button className="btn-amber" onClick={handleCalculate} disabled={calculating || loading}>
//               {calculating ? 'Calculating…' : 'Recalculate'}
//             </button>
//           )
//         }
//       />

//       <div className="px-6 md:px-10 pb-16">
//         {loading ? (
//           <Loader label="Loading group…" />
//         ) : error ? (
//           <EmptyState icon="⚠" title="Something went wrong" description={error} />
//         ) : (
//           <>
//             {group?.description && <p className="text-sm text-ink-400 -mt-4 mb-6">{group.description}</p>}

//             <div className="flex gap-1 p-1 bg-ink-50 rounded-lg mb-6 w-fit">
//               {TABS.map((t) => (
//                 <button
//                   key={t.key}
//                   onClick={() => setTab(t.key)}
//                   className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
//                     tab === t.key ? 'bg-white shadow-sm text-ink-900' : 'text-ink-400'
//                   }`}
//                 >
//                   {t.label}
//                 </button>
//               ))}
//             </div>

//             {tab === 'expenses' &&
//               (expenses.length === 0 ? (
//                 <EmptyState
//                   icon="🧾"
//                   title="No expenses yet"
//                   description="Add the first expense for this group — it'll be split automatically."
//                   action={
//                     <button className="btn-primary" onClick={() => setExpenseModalOpen(true)}>
//                       Add an expense
//                     </button>
//                   }
//                 />
//               ) : (
//                 <div className="card px-5">
//                   {expenses.map((e) => (
//                     <ExpenseItem key={e.id} expense={e} onDelete={handleDeleteExpense} />
//                   ))}
//                 </div>
//               ))}

//             {tab === 'settlements' && (
//               <div className="space-y-6">
//                 {balances.length > 0 && (
//                   <div className="card p-5">
//                     <p className="font-display font-semibold text-ink-900 mb-4">Balances</p>
//                     <div className="space-y-3">
//                       {balances.map((b, idx) => (
//                         <div key={b.userId || idx} className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <Avatar name={b.name || b.userId} size="sm" />
//                             <span className="text-sm font-medium text-ink-700">{b.name || b.userId}</span>
//                           </div>
//                           <BalancePill amount={b.balance ?? b.amount} />
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <div>
//                   <p className="font-display font-semibold text-ink-900 mb-4">Pending settlements</p>
//                   {pending.length === 0 ? (
//                     <EmptyState
//                       icon="✓"
//                       title="All settled up"
//                       description="No pending payments in this group."
//                     />
//                   ) : (
//                     <div className="space-y-3">
//                       {pending.map((t, idx) => (
//                         <SettlementCard key={t.id || idx} transaction={t} onSettle={handleSettle} />
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {tab === 'members' &&
//               (members.length === 0 ? (
//                 <EmptyState icon="👥" title="No members yet" description="Add people to start splitting expenses." />
//               ) : (
//                 <div className="card divide-y divide-ink-50">
//                   {members.map((m) => (
//                     <div key={m.id || m.email} className="flex items-center gap-3 px-5 py-4">
//                       <Avatar name={m.name || m.email} />
//                       <div>
//                         <p className="text-sm font-semibold text-ink-900">{m.name || m.email}</p>
//                         {m.email && <p className="text-xs text-ink-400">{m.email}</p>}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ))}
//           </>
//         )}
//       </div>

//       <Modal
//         open={expenseModalOpen}
//         onClose={() => setExpenseModalOpen(false)}
//         title="Add an expense"
//       >
//         <ExpenseForm
//           groupId={groupId}
//           members={members}
//           submitting={submittingExpense}
//           onSubmit={handleAddExpense}
//           onCancel={() => setExpenseModalOpen(false)}
//         />
//       </Modal>

//       <Modal open={memberModalOpen} onClose={() => setMemberModalOpen(false)} title="Add a member">
//         <form onSubmit={handleAddMember} className="space-y-4">
//           <div>
//             <label className="label">Email address</label>
//             <input
//               type="email"
//               required
//               className="input"
//               placeholder="friend@example.com"
//               value={memberEmail}
//               onChange={(e) => setMemberEmail(e.target.value)}
//             />
//           </div>
//           {memberError && (
//             <div className="text-sm text-coral-600 bg-coral-50 rounded-lg px-3.5 py-2.5">{memberError}</div>
//           )}
//           <div className="flex justify-end gap-2 pt-2">
//             <button type="button" className="btn-secondary" onClick={() => setMemberModalOpen(false)}>
//               Cancel
//             </button>
//             <button type="submit" disabled={addingMember} className="btn-primary">
//               {addingMember ? 'Adding…' : 'Add member'}
//             </button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   )
// }
