import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api-service.vercel.app/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

export default apiClient;

