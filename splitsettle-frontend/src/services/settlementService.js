import api from './api'

export const settlementService = {
  async getBalances(groupId) {
    const { data } = await api.get(`/api/settlements/group/${groupId}/balances`)
    return data
  },

  async calculateSettlements(groupId) {
    const { data } = await api.post(`/api/settlements/group/${groupId}/calculate`)
    return data
  },

  async getPendingSettlements(groupId) {
    const { data } = await api.get(`/api/settlements/group/${groupId}/pending`)
    return data
  },

  async markSettled(transactionId) {
    const { data } = await api.post(`/api/settlements/${transactionId}/settle`)
    return data
  },
}

export default settlementService
