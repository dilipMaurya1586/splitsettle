import api from './api'

export const expenseService = {
  async getGroupExpenses(groupId) {
    const { data } = await api.get(`/api/expenses/group/${groupId}`)
    return data
  },

  async addExpense(payload) {
    // payload: { groupId, description, amount, paidBy, splitBetween: [] }
    const { data } = await api.post('/api/expenses', payload)
    return data
  },

  async updateExpense(expenseId, payload) {
    const { data } = await api.put(`/api/expenses/${expenseId}`, payload)
    return data
  },

  async deleteExpense(expenseId) {
    const { data } = await api.delete(`/api/expenses/${expenseId}`)
    return data
  },

  // Optional: AI natural-language expense parsing
  // async parseExpenseText(text, groupId) {
  //   const { data } = await api.post('/api/ai/parse-expense', { text, groupId })
  //   return data
  // },
  async parseExpenseText(text, groupId) {
    const { data } = await api.post('/api/ai/parse-expense', { naturalLanguageInput: text, groupId })
    return data
  },
}

export default expenseService
