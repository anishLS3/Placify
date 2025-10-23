import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const getExperiences = () => api.get('/experiences')
export const addExperience = (data) => api.post('/experiences', data)
export const submitContact = (data) => api.post('/contact', data)

export default api