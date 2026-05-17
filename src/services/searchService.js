import api from './api';

const searchService = {
    // Obtener historial de búsquedas
    getHistory: async () => {
        const response = await api.get('/search/history');
        return response.data;
    },

    // Guardar búsqueda en historial
    saveSearch: async (searchData) => {
        const response = await api.post('/search/history', searchData);
        return response.data;
    },

    // Eliminar búsqueda específica del historial
    deleteSearch: async (id) => {
        const response = await api.delete(`/search/history/${id}`);
        return response.data;
    },

    // Limpiar todo el historial
    clearHistory: async () => {
        const response = await api.delete('/search/history');
        return response.data;
    },
};

export default searchService;