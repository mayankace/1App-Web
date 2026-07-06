import API from './api';

const authService = {
    login: async (identifier, password) => {
        // identifier can be email or phone
        const payload = identifier.includes('@')
            ? { email: identifier, password }
            : { phone: identifier, password };
        const response = await API.post('/auth/login', payload);
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

    googleAuth: async ({ googleId, email, name, avatar }) => {
        const response = await API.post('/auth/google', { googleId, email, name, avatar });
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
