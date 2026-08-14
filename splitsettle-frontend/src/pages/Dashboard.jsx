import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import StatCard from '../components/StatCard'
import GroupCard from '../components/GroupCard'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import BalancePill from '../components/BalancePill'
import Avatar from '../components/Avatar'
import { useAuth } from '../context/AuthContext'
import groupService from '../services/groupService'
import settlementService from '../services/settlementService'
import { formatCurrency } from '../utils/format'

export default function Dashboard() {
  const { user } = useAuth()
  const [groups, setGroups] = useState([])
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const myGroups = await groupService.getMyGroups()
        if (cancelled) return
        setGroups(Array.isArray(myGroups) ? myGroups : myGroups?.groups || [])

        // Pull pending settlements across the user's groups (best-effort;
        // if a group call fails we just skip it rather than blocking the page)
        const groupList = Array.isArray(myGroups) ? myGroups : myGroups?.groups || []
        const results = await Promise.allSettled(
          groupList.map((g) => settlementService.getPendingSettlements(g.id)),
        )
        if (cancelled) return
        const merged = results
          .filter((r) => r.status === 'fulfilled')
          .flatMap((r) => (Array.isArray(r.value) ? r.value : r.value?.transactions || []))
        setPending(merged)
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Could not load your dashboard.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const totalOwed = pending
    .filter((t) => (t.toId || t.to) === (user?.id || user?.email))
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)
  const totalOwe = pending
    .filter((t) => (t.fromId || t.from) === (user?.id || user?.email))
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)
  const netBalance = totalOwed - totalOwe

  return (
    <div>
      <Header
        subtitle={`Hi ${user?.name?.split(' ')[0] || 'there'} 👋`}
        title="Your overview"
        actions={
          <Link to="/groups" className="btn-primary">
            + New group
          </Link>
        }
      />

      <div className="px-6 md:px-10 pb-16 space-y-8">
        {loading ? (
          <Loader label="Loading your dashboard…" />
        ) : error ? (
          <EmptyState icon="⚠" title="Something went wrong" description={error} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Net balance"
                value={formatCurrency(netBalance)}
                tone={netBalance >= 0 ? 'owed' : 'owe'}
                icon="⚖"
              />
              <StatCard label="You are owed" value={formatCurrency(totalOwed)} tone="owed" icon="↙" />
              <StatCard label="You owe" value={formatCurrency(totalOwe)} tone="owe" icon="↗" />
            </div>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-ink-900">Your groups</h2>
                <Link to="/groups" className="text-sm font-semibold text-teal-600 hover:underline">
                  View all
                </Link>
              </div>

              {groups.length === 0 ? (
                <EmptyState
                  icon="⬡"
                  title="No groups yet"
                  description="Create a group to start splitting expenses with friends, roommates, or your travel crew."
                  action={
                    <Link to="/groups" className="btn-primary">
                      Create your first group
                    </Link>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groups.slice(0, 6).map((g) => (
                    <GroupCard key={g.id} group={g} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-ink-900">Pending settlements</h2>
                <Link to="/settlements" className="text-sm font-semibold text-teal-600 hover:underline">
                  View all
                </Link>
              </div>

              {pending.length === 0 ? (
                <EmptyState icon="✓" title="All settled up" description="No pending payments right now — nice." />
              ) : (
                <div className="card divide-y divide-ink-50">
                  {pending.slice(0, 5).map((t, idx) => (
                    <div key={t.id || idx} className="flex items-center gap-3 px-5 py-3.5">
                      <Avatar name={t.fromName || t.from} size="sm" />
                      <p className="text-sm text-ink-700 flex-1 min-w-0 truncate">
                        <span className="font-semibold">{t.fromName || t.from}</span> owes{' '}
                        <span className="font-semibold">{t.toName || t.to}</span>
                      </p>
                      <BalancePill amount={-Math.abs(t.amount)} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}
