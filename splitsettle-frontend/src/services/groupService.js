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
    // payload: { userId, userEmail, userFullName } — group-service requires all three
    const { data } = await api.post(`/api/groups/${groupId}/members`, payload)
    return data
  },

  async lookupUserByEmail(email) {
    // Hits user-service to resolve { id, email, fullName } for a given email.
    // Throws (404) if no account exists with that email.
    const { data } = await api.get('/api/users/lookup', { params: { email } })
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
