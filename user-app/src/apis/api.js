import axios from 'axios'

export const Api =()=> axios.create({
  baseURL: 'http://localhost:3000/api/v1/',
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

//process.env.VUE_APP_API_ENDPOINT ||
