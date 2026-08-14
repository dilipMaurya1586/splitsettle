import api from './api'

export const authService = {
  async register(payload) {
    // payload: { name, email, password }
    const { data } = await api.post('/api/auth/register', payload)
    return data
  },

  async login(payload) {
    // payload: { email, password }
    const { data } = await api.post('/api/auth/login', payload)
    return data
  },

  logout() {
    localStorage.removeItem('splitsettle_token')
    localStorage.removeItem('splitsettle_user')
  },

  getToken() {
    return localStorage.getItem('splitsettle_token')
  },

  getStoredUser() {
    const raw = localStorage.getItem('splitsettle_user')
    return raw ? JSON.parse(raw) : null
  },

  saveSession(token, user) {
    localStorage.setItem('splitsettle_token', token)
    if (user) {
      localStorage.setItem('splitsettle_user', JSON.stringify(user))
    }
  },
}

export default authService
