import API from './api';

const serviceService = {
    getAllServices: async (filters = {}) => {
        const { category, subcategory, search } = filters;
        let url = '/services';
        const params = [];
        if (category) params.push(`category=${encodeURIComponent(category)}`);
        if (subcategory) params.push(`subcategory=${encodeURIComponent(subcategory)}`);
        if (search) params.push(`search=${encodeURIComponent(search)}`);
        if (params.length > 0) url += `?${params.join('&')}`;
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
    },

    getSubCategories: async (categoryId = '') => {
        const url = categoryId ? `/services/subcategories?category=${categoryId}` : '/services/subcategories';
        const response = await API.get(url);
        return response.data;
    },

    getServiceHierarchy: async () => {
        const response = await API.get('/services/hierarchy');
        return response.data;
    },

    getSubcategoriesByCategoryId: async (categoryId) => {
        const response = await API.get(`/services/categories/${categoryId}/subcategories`);
        return response.data;
    },

    getServicesBySubcategoryId: async (subcategoryId) => {
        const response = await API.get(`/services/subcategories/${subcategoryId}/services`);
        return response.data;
    },
};

export default serviceService;