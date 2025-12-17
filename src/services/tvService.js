import api from './api';

const tvService = {
    // Series más populares
    getPopular: async (page = 1) => {
        const response = await api.get(`/tv/popular?page=${page}`);
        return response.data;
    },

    // Series mejor valoradas
    getTopRated: async (page = 1) => {
        const response = await api.get(`/tv/top-rated?page=${page}`);
        return response.data;
    },

    // Serie al aire
    getOnTheAir: async (page = 1) => {
        const response = await api.get(`/tv/on-the-air?page=${page}`);
        return response.data;
    },

    // Detalle de serie
    getDetail: async (id) => {
        const response = await api.get(`/tv/${id}`);
        return response.data;
    },

    // Buscar series
    search: async (query, page = 1) => {
        const response = await api.get(`/tv/search?query=${query}&page=${page}`);
        return response.data;
    },

    // Serie similares
    getSimilar: async (id, page = 1) => {
        const response = await api.get(`/tv/${id}/similar?page=${page}`);
        return response.data;
    },

    // Obtener proveedores de streaming
    getProviders: async (id) => {
        const response = await api.get(`/tv/${id}/providers`);
        return response.data;
    },
};

export default tvService;