import api from './api'

export const groupService = {
  async getMyGroups() {
    const { data } = await api.get('/api/groups/my')
    return data
  },

  async getGroup(groupId) {
    const { data } = await api.get(`/api/groups/${groupId}`)
    return data
  },

  async createGroup(payload) {
    // payload: { name, description }
    const { data } = await api.post('/api/groups', payload)
    return data
  },

  async addMember(groupId, payload) {
    // payload: { email } or { userId }
    const { data } = await api.post(`/api/groups/${groupId}/members`, payload)
    return data
  },
}

export default groupService
