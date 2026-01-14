import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:5000/api' })

API.interceptors.request.use(req => {
  const token = localStorage.getItem('token')
  if (token) req.headers.Authorization = `Bearer ${token}`
  return req

})

export const register = d => API.post('/auth/register', d)
export const login = d => API.post('/auth/login', d)

export const getBusinesses = p => API.get('/businesses', { params: p })
export const getBusiness = id => API.get(`/businesses/${id}`)
export const createBusiness = d => API.post('/businesses', d)

export const updateBusiness = (id, d) => API.put(`/businesses/${id}`, d)
export const deleteBusiness = id => API.delete(`/businesses/${id}`)

export const getReviews = id => API.get(`/reviews/business/${id}`)
export const submitReview = d => API.post('/reviews', d)
export const getPendingReviews = () => API.get('/reviews/pending')
export const updateReviewStatus = (id, status) => API.patch(`/reviews/${id}/status`, { status })
export const deleteReview = id => API.delete(`/reviews/${id}`)

export default API
