import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': API_BASE_URL,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': true,
    },
});

// Request interceptor to attach JWT token to headers
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // If unauthorized, clear token and redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    register: (userData) => apiClient.post('/auth/register', userData),
    login: (credentials) => apiClient.post('/auth/login', credentials),
    getProfile: () => apiClient.get('/auth/profile'),
    updateProfile: (data) => apiClient.put('/auth/profile', data),
    updatePassword: (data) => apiClient.put('/auth/password', data),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};

// Daily Tracker API calls
export const trackerAPI = {
    createOrUpdate: (data) => apiClient.post('/tracker', data),
    getAll: (params) => apiClient.get('/tracker', { params }),
    getByDate: (date) => apiClient.get(`/tracker/${date}`),
    delete: (date) => apiClient.delete(`/tracker/${date}`),
    getStats: (params) => apiClient.get('/tracker/stats/summary', { params }),
};

// Mock Tracker API calls
export const mockAPI = {
    create: (data) => apiClient.post('/mock', data),
    getAll: (params) => apiClient.get('/mock', { params }),
    getById: (id) => apiClient.get(`/mock/${id}`),
    update: (id, data) => apiClient.put(`/mock/${id}`, data),
    delete: (id) => apiClient.delete(`/mock/${id}`),
    getStats: (params) => apiClient.get('/mock/stats/summary', { params }),
};

// Mock Analysis API calls
export const mockAnalysisAPI = {
    create: (data) => apiClient.post('/mock-analysis', data),
    getAll: (params) => apiClient.get('/mock-analysis', { params }),
    getById: (id) => apiClient.get(`/mock-analysis/${id}`),
    update: (id, data) => apiClient.put(`/mock-analysis/${id}`, data),
    delete: (id) => apiClient.delete(`/mock-analysis/${id}`),
    getStats: () => apiClient.get('/mock-analysis/stats/summary'),
};

// Soft Skills API calls
export const softSkillsAPI = {
    create: (data) => apiClient.post('/softskills', data),
    getAll: (params) => apiClient.get('/softskills', { params }),
    getById: (id) => apiClient.get(`/softskills/${id}`),
    update: (id, data) => apiClient.put(`/softskills/${id}`, data),
    delete: (id) => apiClient.delete(`/softskills/${id}`),
    getStats: (params) => apiClient.get('/softskills/stats/summary', { params }),
};

// Insights API calls
export const insightsAPI = {
    getDashboard: (params) => apiClient.get('/insights/dashboard', { params }),
};

// AI API calls
export const aiAPI = {
    chat: (data) => apiClient.post('/ai/chat', data),
};

export default apiClient;

