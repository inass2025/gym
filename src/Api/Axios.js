import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.51.68',
  withCredentials: true, // important pour Sanctum
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Attache automatiquement le token si dispo
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;