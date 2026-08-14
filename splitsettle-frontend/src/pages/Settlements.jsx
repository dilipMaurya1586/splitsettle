import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import SettlementCard from '../components/SettlementCard'
import groupService from '../services/groupService'
import settlementService from '../services/settlementService'

export default function Settlements() {
  const [groups, setGroups] = useState([])
  const [activeGroupId, setActiveGroupId] = useState('')
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingTx, setLoadingTx] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function loadGroups() {
      setLoading(true)
      setError(null)
      try {
        const data = await groupService.getMyGroups()
        const list = Array.isArray(data) ? data : data?.groups || []
        if (cancelled) return
        setGroups(list)
        if (list.length) setActiveGroupId(list[0].id)
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Could not load your groups.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadGroups()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!activeGroupId) return
    let cancelled = false
    async function loadPending() {
      setLoadingTx(true)
      try {
        const data = await settlementService.getPendingSettlements(activeGroupId)
        if (cancelled) return
        setPending(Array.isArray(data) ? data : data?.transactions || [])
      } catch {
        if (!cancelled) setPending([])
      } finally {
        if (!cancelled) setLoadingTx(false)
      }
    }
    loadPending()
    return () => {
      cancelled = true
    }
  }, [activeGroupId])

  async function handleSettle(transaction) {
    await settlementService.markSettled(transaction.id)
    const data = await settlementService.getPendingSettlements(activeGroupId)
    setPending(Array.isArray(data) ? data : data?.transactions || [])
  }

  return (
    <div>
      <Header subtitle="Who owes whom" title="Settlements" />

      <div className="px-6 md:px-10 pb-16">
        {loading ? (
          <Loader label="Loading your groups…" />
        ) : error ? (
          <EmptyState icon="⚠" title="Something went wrong" description={error} />
        ) : groups.length === 0 ? (
          <EmptyState
            icon="⬡"
            title="No groups yet"
            description="Create a group and add expenses — settlements will show up here automatically."
          />
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveGroupId(g.id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                    activeGroupId === g.id
                      ? 'bg-teal-500 border-teal-500 text-white'
                      : 'bg-white border-ink-100 text-ink-400 hover:border-teal-200'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>

            {loadingTx ? (
              <Loader label="Loading settlements…" />
            ) : pending.length === 0 ? (
              <EmptyState icon="✓" title="All settled up" description="No pending payments in this group." />
            ) : (
              <div className="space-y-3">
                {pending.map((t, idx) => (
                  <SettlementCard key={t.id || idx} transaction={t} onSettle={handleSettle} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
