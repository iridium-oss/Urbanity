import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const API = `${BACKEND_URL}/api`;

const api = axios.create({ baseURL: API, timeout: 15000 });

api.interceptors.request.use(config => {
  try {
    const stored = localStorage.getItem('urbanivity_user');
    if (stored) {
      const user = JSON.parse(stored);
      if (user.access_token) {
        config.headers.Authorization = `Bearer ${user.access_token}`;
      }
    }
  } catch (error) {}
  return config;
});

export const fetchOverview = () => api.get('/dashboard/overview').then(r => r.data);
export const fetchMobilityModes = () => api.get('/mobility-modes').then(r => r.data);
export const fetchModeDetail = (modeId) => api.get(`/mobility-modes/${modeId}/detail`).then(r => r.data);
export const fetchProviders = () => api.get('/providers').then(r => r.data);
export const fetchAlerts = (params) => api.get('/alerts', { params }).then(r => r.data);
export const fetchTransitNetwork = () => api.get('/transit/network').then(r => r.data);
export const fetchDemoRoute = () => api.get('/routing/demo').then(r => r.data);
export const fetchCongestion = (corridor) => api.get('/forecasting/congestion', { params: { corridor } }).then(r => r.data);
export const fetchEquity = () => api.get('/equity/districts').then(r => r.data);
export const fetchEarthObs = () => api.get('/earth-observation').then(r => r.data);
export const fetchDemoGuide = () => api.get('/demo/guide').then(r => r.data);
export const resetDemo = () => api.post('/demo/reset').then(r => r.data);
