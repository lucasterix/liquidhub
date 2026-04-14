import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

export async function analyze(payload: unknown) {
  const { data } = await api.post('/analyze', payload);
  return data;
}

export async function fetchCharts() {
  const { data } = await api.get('/charts');
  return data;
}
