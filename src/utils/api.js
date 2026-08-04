import axios from 'axios';
import { BASE_URL } from './constants';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const apiCall = async (endpoint, method = 'GET', body = null) => {
  try {
    const response = await api({
      url: endpoint,
      method,
      data: body,
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.log(endpoint,method,body)
    if (error.response) {
      return {
        status: error.response.status,
        data: error.response.data,
      };
    }

    return {
      status: 500,
      data: {
        message: error.message || 'Network Error',
      },
    };
  }
};