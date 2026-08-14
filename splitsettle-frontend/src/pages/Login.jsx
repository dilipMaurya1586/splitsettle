import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await login(form)
    if (res.success) {
      const redirectTo = location.state?.from?.pathname || '/'
      navigate(redirectTo, { replace: true })
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-paper">
      {/* Left: brand panel */}
      <div className="hidden lg:flex lg:w-[46%] bg-ink-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #E8A33D 0%, transparent 35%), radial-gradient(circle at 80% 70%, #0F6B5C 0%, transparent 40%)',
          }}
        />
        <div className="relative flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-amber-500 flex items-center justify-center text-ink-900 font-display font-bold">
            S
          </div>
          <span className="font-display text-xl font-bold">SplitSettle</span>
        </div>

        <div className="relative">
          <p className="eyebrow text-amber-400 mb-3">Split fair. Settle fast.</p>
          <h2 className="font-display text-4xl font-bold leading-tight mb-4">
            Every shared bill,
            <br />
            down to the last rupee.
          </h2>
          <p className="text-ink-100/60 max-w-sm">
            Track group expenses, split them fairly, and let SplitSettle work out the fewest payments
            needed to clear every debt.
          </p>
        </div>

        <div className="relative flex items-center gap-6 text-sm text-ink-100/50 font-mono">
          <span>01 — Add expense</span>
          <span>02 — Auto-split</span>
          <span>03 — Settle up</span>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
            <div className="h-9 w-9 rounded-lg bg-amber-500 flex items-center justify-center text-ink-900 font-display font-bold">
              S
            </div>
            <span className="font-display text-xl font-bold text-ink-900">SplitSettle</span>
          </div>

          <p className="eyebrow mb-2">Welcome back</p>
          <h1 className="font-display text-2xl font-bold text-ink-900 mb-8">Log in to your account</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                required
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                required
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {error && (
              <div className="text-sm text-coral-600 bg-coral-50 rounded-lg px-3.5 py-2.5">{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="text-sm text-ink-400 text-center mt-6">
            New to SplitSettle?{' '}
            <Link to="/register" className="text-teal-600 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
