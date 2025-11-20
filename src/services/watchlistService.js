import api from './api';

const watchlistService = {
    // Obtener toda la watchlist del usuario
    getAll: async () => {
        const response = await api.get('/watchlist');
        return response.data;
    },

    // Agregar a watchlist
    add: async (mediaData) => {
        const response = await api.post('/watchlist', mediaData);
        return response.data;
    },

    // Verificar si está en watchlist
    check: async (mediaType, tmdbId) => {
        const response = await api.get(`/watchlist/check/${mediaType}/${tmdbId}`);
        return response.data;
    },

    // Actualizar item de watchlist (status, rating, notes)
    update: async (id, data) => {
        const response = await api.put(`/watchlist/${id}`, data);
        return response.data;
    },

    // Eliminar de watchlist
    remove: async (id) => {
        const response = await api.delete(`/watchlist/${id}`);
        return response.data;
    },
};

export default watchlistService;