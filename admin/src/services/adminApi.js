import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 15000
});

// Interceptor to add Admin Token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('vmarc_admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle unauthorized access
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('vmarc_admin_token');
        }
        return Promise.reject(error);
    }
);

const adminApi = {
    login: async (email, password) => {
        const res = await API.post('/admin/login', { email, password });
        if (res.data.token) {
            localStorage.setItem('vmarc_admin_token', res.data.token);
        }
        return res.data;
    },

    logout: () => {
        localStorage.removeItem('vmarc_admin_token');
    },

    getStats: async () => {
        const res = await API.get('/admin/stats');
        return res.data;
    },

    getBookings: async (filters = {}) => {
        const { status, paymentStatus, search } = filters;
        let url = '/admin/bookings';
        const params = [];
        if (status) params.push(`status=${encodeURIComponent(status)}`);
        if (paymentStatus) params.push(`paymentStatus=${encodeURIComponent(paymentStatus)}`);
        if (search) params.push(`search=${encodeURIComponent(search)}`);
        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }
        const res = await API.get(url);
        return res.data;
    },

    updateBooking: async (id, bookingData) => {
        const res = await API.put(`/admin/bookings/${id}`, bookingData);
        return res.data;
    },

    getUsers: async () => {
        const res = await API.get('/admin/users');
        return res.data;
    },

    // Services CRUD (calls backend /services directly but uses admin token via interceptor)
    getServices: async (filters = {}) => {
        const { serviceName, category, subcategory, search } = filters;
        let url = '/services';
        const params = [];
        if (serviceName) params.push(`serviceName=${encodeURIComponent(serviceName)}`);
        if (category) params.push(`category=${encodeURIComponent(category)}`);
        if (subcategory) params.push(`subcategory=${encodeURIComponent(subcategory)}`);
        if (search) params.push(`search=${encodeURIComponent(search)}`);
        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }
        const res = await API.get(url);
        return res.data;
    },

    createService: async (formData) => {
        const res = await API.post('/services', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    },

    updateService: async (id, formData) => {
        const res = await API.put(`/services/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    },

    deleteService: async (id) => {
        const res = await API.delete(`/services/${id}`);
        return res.data;
    },

    // ─── CATEGORY ────────────────────────────────────────────────────────────────
    getCategories: async () => {
        const res = await API.get('/services/categories');
        return res.data;
    },

    createCategory: async (formData) => {
        const res = await API.post('/services/categories', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    },

    updateCategory: async (id, formData) => {
        const res = await API.put(`/services/categories/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    },

    deleteCategory: async (id) => {
        const res = await API.delete(`/services/categories/${id}`);
        return res.data;
    },

    // ─── SUBCATEGORY ─────────────────────────────────────────────────────────────
    getSubCategories: async (categoryId = '') => {
        const url = categoryId ? `/services/subcategories?category=${categoryId}` : '/services/subcategories';
        const res = await API.get(url);
        return res.data;
    },

    createSubCategory: async (formData) => {
        const res = await API.post('/services/subcategories', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    },

    updateSubCategory: async (id, formData) => {
        const res = await API.put(`/services/subcategories/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    },

    deleteSubCategory: async (id) => {
        const res = await API.delete(`/services/subcategories/${id}`);
        return res.data;
    },

    // ─── SERVICE HIERARCHY ───────────────────────────────────────────────────────
    getServiceHierarchy: async () => {
        const res = await API.get('/services/hierarchy');
        return res.data;
    },
};

export default adminApi;
