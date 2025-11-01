import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
}

// Sessions API
export const sessionsAPI = {
  create: (data) => api.post('/sessions/', data),
  getAll: () => api.get('/sessions/'),
  getOne: (id) => api.get(`/sessions/${id}`),
  update: (id, data) => api.patch(`/sessions/${id}`, data),
  delete: (id) => api.delete(`/sessions/${id}`),
}

// Chat API
export const chatAPI = {
  sendMessage: (data) => api.post('/chat/', data),
  getMessages: (sessionId) => api.get(`/chat/${sessionId}/messages`),
  generateScenario: (sessionId) => api.post(`/chat/scenario/${sessionId}`),
}

// Evaluation API
export const evaluationAPI = {
  evaluate: (data) => api.post('/evaluation/', data),
  getReports: () => api.get('/evaluation/reports'),
  getReport: (id) => api.get(`/evaluation/reports/${id}`),
  getSessionReport: (sessionId) => api.get(`/evaluation/session/${sessionId}/report`),
}

export default api
