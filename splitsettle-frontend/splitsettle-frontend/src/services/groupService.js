import api from './api'
import authService from './authService'

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
    const token = authService.getToken()
    if (!token) {
      throw new Error('Not authenticated')
    }
    const { data } = await api.post('/api/groups', payload)
    return data
  },

  async addMember(groupId, payload) {
    const token = authService.getToken()
    if (!token) {
      throw new Error('Not authenticated')
    }
    const { data } = await api.post(`/api/groups/${groupId}/members`, payload)
    return data
  },
}

export default groupService




// import api from './api'

// export const groupService = {
//   async getMyGroups() {
//     const { data } = await api.get('/api/groups/my')
//     return data
//   },

//   async getGroup(groupId) {
//     const { data } = await api.get(`/api/groups/${groupId}`)
//     return data
//   },

//   async createGroup(payload) {
//     // payload: { name, description }
//     const { data } = await api.post('/api/groups', payload)
//     return data
//   },

//   async addMember(groupId, payload) {
//     // payload: { email } or { userId }
//     const { data } = await api.post(`/api/groups/${groupId}/members`, payload)
//     return data
//   },
// }

// export default groupService
