
import api from './api'
import authService from './authService'

export const expenseService = {
  async getGroupExpenses(groupId) {
    const { data } = await api.get(`/api/expenses/group/${groupId}`)
    return data
  },

  async addExpense(payload) {
    const token = authService.getToken()
    if (!token) throw new Error('Not authenticated')
    const { data } = await api.post('/api/expenses', payload)
    return data
  },

  async updateExpense(expenseId, payload) {
    const token = authService.getToken()
    if (!token) throw new Error('Not authenticated')
    const { data } = await api.put(`/api/expenses/${expenseId}`, payload)
    return data
  },

  async deleteExpense(expenseId) {
    const token = authService.getToken()
    if (!token) throw new Error('Not authenticated')
    const { data } = await api.delete(`/api/expenses/${expenseId}`)
    return data
  },

  async parseExpenseText(text, groupId) {
    const token = authService.getToken()
    if (!token) throw new Error('Not authenticated')
    const { data } = await api.post('/api/ai/parse-expense', { 
      naturalLanguageInput: text 
    })
    return data
  },
}

export default expenseService













// import api from './api'

// export const expenseService = {
//   async getGroupExpenses(groupId) {
//     const { data } = await api.get(`/api/expenses/group/${groupId}`)
//     return data
//   },

//   async addExpense(payload) {
//     // payload: { groupId, description, amount, paidBy, splitBetween: [] }
//     const { data } = await api.post('/api/expenses', payload)
//     return data
//   },

//   async updateExpense(expenseId, payload) {
//     const { data } = await api.put(`/api/expenses/${expenseId}`, payload)
//     return data
//   },

//   async deleteExpense(expenseId) {
//     const { data } = await api.delete(`/api/expenses/${expenseId}`)
//     return data
//   },

//   // Optional: AI natural-language expense parsing
// async parseExpenseText(text, groupId) {
//   const { data } = await api.post('/api/ai/parse-expense', { 
//     naturalLanguageInput: text  // Change 'text' to 'naturalLanguageInput'
//   })
//   return data
// }
// }

// export default expenseService
