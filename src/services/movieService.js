import api from './api';

const movieService = {
    // Películas populares
    getPopular: async (page = 1) => {
        const response = await api.get(`/movies/popular?page=${page}`);
        return response.data;
    },

    // Películas mejor valoradas
    getTopRated: async (page = 1) => {
        const response = await api.get(`/movies/top-rated?page=${page}`);
        return response.data;
    },

    // Próximos estrenos
    getUpcoming: async (page = 1) => {
        const response = await api.get(`/movies/upcoming?page=${page}`);
        return response.data;
    },

    // Detalle de película
    getDetail: async (id) => {
        const response = await api.get(`/movies/${id}`);
        return response.data;
    },

    // Buscar películas
    search: async (query, page = 1) => {
        const response = await api.get(`/movies/search?query=${query}&page=${page}`);
        return response.data;
    },

    // Películas similares
    getSimilar: async (id, page = 1) => {
        const response = await api.get(`/movies/${id}/similar?page=${page}`);
        return response.data;
    },

    // Obtener proveedores de streaming
    getProviders: async (id) => {
        const response = await api.get(`/movies/${id}/providers`);
        return response.data;
    },

    // Obtener géneros de películas
    getGenres: async () => {
        const response = await api.get('/movies/genres/list');
        return response.data;
    },

    // Descubrir películas con filtros
    discover: async (genre = null, page = 1) => {
        const params = { page };
        if (genre) {
            params.genre = genre;
        }
        const response = await api.get('/movies/discover', { params });
        return response.data;
    },
};

export default movieService;