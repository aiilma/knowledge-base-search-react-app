import axios from 'axios'

const api = axios.create({
  baseURL: 'https://cors-anywhere.herokuapp.com/https://support.swarmica.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
