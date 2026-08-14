import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register, loading, error } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await register(form)
    if (res.success) {
      if (res.autoLoggedIn) {
        navigate('/', { replace: true })
      } else {
        setDone(true)
      }
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-paper">
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
          <p className="eyebrow text-amber-400 mb-3">Join in seconds</p>
          <h2 className="font-display text-4xl font-bold leading-tight mb-4">
            No more "you owe me,
            <br />I owe you" texts.
          </h2>
          <p className="text-ink-100/60 max-w-sm">
            Create your account, start a group with your friends or roommates, and let the numbers
            settle themselves.
          </p>
        </div>

        <div className="relative text-sm text-ink-100/50 font-mono">Free forever · No card required</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
            <div className="h-9 w-9 rounded-lg bg-amber-500 flex items-center justify-center text-ink-900 font-display font-bold">
              S
            </div>
            <span className="font-display text-xl font-bold text-ink-900">SplitSettle</span>
          </div>

          {done ? (
            <div className="text-center py-10">
              <div className="h-12 w-12 rounded-full bg-moss-50 text-moss-600 flex items-center justify-center text-2xl mx-auto mb-4">
                ✓
              </div>
              <h1 className="font-display text-xl font-bold text-ink-900 mb-2">Account created</h1>
              <p className="text-sm text-ink-400 mb-6">You can log in now with your new credentials.</p>
              <Link to="/login" className="btn-primary inline-flex">
                Go to login
              </Link>
            </div>
          ) : (
            <>
              <p className="eyebrow mb-2">Get started</p>
              <h1 className="font-display text-2xl font-bold text-ink-900 mb-8">Create your account</h1>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Full name</label>
                  <input
                    required
                    className="input"
                    placeholder="Aditi Sharma"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />
                </div>
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
                    minLength={6}
                    className="input"
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>

                {error && (
                  <div className="text-sm text-coral-600 bg-coral-50 rounded-lg px-3.5 py-2.5">{error}</div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
              </form>

              <p className="text-sm text-ink-400 text-center mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-teal-600 font-semibold hover:underline">
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
