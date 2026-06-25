import API from './api';

const serviceService = {
    getAllServices: async (filters = {}) => {
        const { category, subcategory, search } = filters;
        let url = '/services';
        const params = [];
        if (category) params.push(`category=${encodeURIComponent(category)}`);
        if (subcategory) params.push(`subcategory=${encodeURIComponent(subcategory)}`);
        if (search) params.push(`search=${encodeURIComponent(search)}`);
        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }
        const response = await API.get(url);
        return response.data;
    },

    getServiceById: async (id) => {
        const response = await API.get(`/services/${id}`);
        return response.data;
    },

    getCategories: async () => {
        const response = await API.get('/services/categories');
        return response.data;
    }
};

export default serviceService;
