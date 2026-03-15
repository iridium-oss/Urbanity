import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const api = axios.create({ baseURL: API, timeout: 15000 });

export const fetchOverview = () => api.get('/dashboard/overview').then(r => r.data);
export const fetchMobilityModes = () => api.get('/mobility-modes').then(r => r.data);
export const fetchProviders = () => api.get('/providers').then(r => r.data);
export const fetchAlerts = (params) => api.get('/alerts', { params }).then(r => r.data);
export const fetchTransitNetwork = () => api.get('/transit/network').then(r => r.data);
export const fetchDemoRoute = () => api.get('/routing/demo').then(r => r.data);
export const fetchCongestion = (corridor) => api.get('/forecasting/congestion', { params: { corridor } }).then(r => r.data);
export const fetchEquity = () => api.get('/equity/districts').then(r => r.data);
export const fetchEarthObs = () => api.get('/earth-observation').then(r => r.data);
export const fetchDemoGuide = () => api.get('/demo/guide').then(r => r.data);
export const resetDemo = () => api.post('/demo/reset').then(r => r.data);
