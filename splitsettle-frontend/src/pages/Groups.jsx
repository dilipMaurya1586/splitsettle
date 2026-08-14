import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import GroupCard from '../components/GroupCard'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import Modal from '../components/Modal'
import groupService from '../services/groupService'

export default function Groups() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await groupService.getMyGroups()
      setGroups(Array.isArray(data) ? data : data?.groups || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your groups.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setCreating(true)
    setFormError(null)
    try {
      await groupService.createGroup(form)
      setModalOpen(false)
      setForm({ name: '', description: '' })
      load()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not create the group. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <Header
        subtitle="All your circles"
        title="Groups"
        actions={
          <button className="btn-primary" onClick={() => setModalOpen(true)}>
            + New group
          </button>
        }
      />

      <div className="px-6 md:px-10 pb-16">
        {loading ? (
          <Loader label="Loading your groups…" />
        ) : error ? (
          <EmptyState icon="⚠" title="Something went wrong" description={error} />
        ) : groups.length === 0 ? (
          <EmptyState
            icon="⬡"
            title="No groups yet"
            description="Groups are how you organize shared expenses — a trip, a flat, a recurring dinner club."
            action={
              <button className="btn-primary" onClick={() => setModalOpen(true)}>
                Create your first group
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((g) => (
              <GroupCard key={g.id} group={g} />
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create a new group">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Group name</label>
            <input
              required
              className="input"
              placeholder="Goa Trip 2026"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Description (optional)</label>
            <input
              className="input"
              placeholder="Weekend getaway with the gang"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          {formError && (
            <div className="text-sm text-coral-600 bg-coral-50 rounded-lg px-3.5 py-2.5">{formError}</div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" disabled={creating} className="btn-primary">
              {creating ? 'Creating…' : 'Create group'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
