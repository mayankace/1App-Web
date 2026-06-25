import API from './api';

const authService = {
    login: async (email, password) => {
        const response = await API.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('vmarc_token', response.data.token);
        }
        return response.data;
    },

    register: async (userData) => {
        const response = await API.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('vmarc_token', response.data.token);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('vmarc_token');
    },

    getMe: async () => {
        const response = await API.get('/auth/me');
        return response.data;
    },

    updateMe: async (userData) => {
        const response = await API.put('/auth/me', userData);
        return response.data;
    },

    sendOTP: async () => {
        const response = await API.post('/auth/send-otp');
        return response.data;
    },

    verifyOTP: async (code) => {
        const response = await API.post('/auth/verify-otp', { code });
        return response.data;
    }
};

export default authService;
