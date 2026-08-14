export function formatCurrency(value, currency = 'INR') {
  const num = Number(value) || 0
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(num)
  } catch {
    return `₹${num.toFixed(2)}`
  }
}

export function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

// Deterministic pastel-ish avatar color from a name/email string
const AVATAR_PALETTE = ['#0F6B5C', '#2C8C79', '#E8A33D', '#C9842A', '#E3595A', '#2FA37A', '#163634']
export function avatarColor(seed = '') {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  const idx = Math.abs(hash) % AVATAR_PALETTE.length
  return AVATAR_PALETTE[idx]
}
