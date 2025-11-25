import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Serviços para Veterinários
export const veterinarioService = {
  getAll: () => api.get('/veterinario'),
  getById: (id) => api.get(`/veterinario/${id}`),
  create: (data) => api.post('/veterinario', data),
  update: (id, data) => api.put(`/veterinario/${id}`, data),
  delete: (id) => api.delete(`/veterinario/${id}`),
};

// Serviços para Tutores
export const tutorService = {
  getAll: () => api.get('/tutor'),
  getById: (id) => api.get(`/tutor/${id}`),
  create: (data) => api.post('/tutor', data),
  update: (id, data) => api.put(`/tutor/${id}`, data),
  delete: (id) => api.delete(`/tutor/${id}`),
};

// Serviços para Pets
export const petService = {
  getAll: () => api.get('/pet'),
  getById: (id) => api.get(`/pet/${id}`),
  create: (data) => api.post('/pet', data),
  update: (id, data) => api.put(`/pet/${id}`, data),
  delete: (id) => api.delete(`/pet/${id}`),
};

// Serviços para Consultas
export const consultaService = {
  getAll: () => api.get('/consulta'),
  getById: (id) => api.get(`/consulta/${id}`),
  create: (data) => api.post('/consulta', data),
  update: (id, data) => api.put(`/consulta/${id}`, data),
  delete: (id) => api.delete(`/consulta/${id}`),
};

export default api;