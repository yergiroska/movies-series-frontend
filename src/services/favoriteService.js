import api from './api';

const favoriteService = {
    // Listar favoritos
    getAll: async () => {
        const response = await api.get('/favorites');
        return response.data;
    },

    // Agregar a favoritos
    add: async (tmdb_id, media_type, title, poster_path, overview) => {
        const response = await api.post('/favorites', {
            tmdb_id,
            media_type,
            title,
            poster_path,
            overview,
        });
        return response.data;
    },

    // Eliminar de favoritos
    remove: async (id) => {
        const response = await api.delete(`/favorites/${id}`);
        return response.data;
    },

    // Verificar si és un favorito
    check: async (mediaType, tmdbId) => {
        const response = await api.get(`/favorites/check/${mediaType}/${tmdbId}`);
        return response.data;
    },

    // Eliminar por TMDB ID
    removeByTmdb: async (mediaType, tmdbId) => {
        const response = await api.delete(`/favorites/${mediaType}/${tmdbId}`);
        return response.data;
    },
};

export default favoriteService;