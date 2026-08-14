import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper text-center px-6">
      <p className="font-mono text-sm text-teal-500 mb-2">404</p>
      <h1 className="font-display text-3xl font-bold text-ink-900 mb-3">Page not found</h1>
      <p className="text-ink-400 mb-8 max-w-sm">
        The page you're looking for doesn't exist, or the link may be broken.
      </p>
      <Link to="/" className="btn-primary">
        Back to dashboard
      </Link>
    </div>
  )
}
