import axios from 'axios';

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to requests
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		
		// Debug logging for invoice creation
		if (config.url === '/invoices' && config.method === 'post') {
			console.log('=== AXIOS REQUEST ===');
			console.log('Request data:', config.data);
			console.log('columnConfiguration in request:', config.data?.columnConfiguration);
			console.log('columnConfiguration type:', typeof config.data?.columnConfiguration);
			console.log('columnConfiguration isArray:', Array.isArray(config.data?.columnConfiguration));
		}
		
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Handle auth errors
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Token expired or invalid
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			localStorage.removeItem('isAuthenticated');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);
