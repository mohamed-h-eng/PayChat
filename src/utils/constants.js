
export const BASE_URL='http://localhost:5000/api'

export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    changePassword: '/auth/change-password',
    logout: '/auth/logout',
  },

  account: {
    create: '/account/create',
    me: '/account/me',
  },

  transaction: {
    deposit: '/transaction/deposit',
    withdraw: '/transaction/withdraw',
    send: '/transaction/send',
    view: '/transaction/view',
  },
};