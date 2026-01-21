import api from './api'

const reviewService = {
    // Obtener todas las reseñas del usuario
    getUserReviews: async () => {
        const response = await api.get('/reviews')
        return response.data
    },

    // Obtener reseña del usuario para una película/serie específica
    getUserReview: async (mediaType, tmdbId) => {
        const response = await api.get('/reviews')
        const reviews = response.data.reviews

        // Filtrar la reseña del usuario actual para este contenido
        return reviews.find(
            review => review.media_type === mediaType && review.tmdb_id === parseInt(tmdbId)
        ) || null
    },

    // Obtener todas las reseñas de una película/serie (de todos los usuarios)
    getAllReviews: async (mediaType, tmdbId) => {
        const response = await api.get(`/reviews/${mediaType}/${tmdbId}`)
        return response.data
    },

    // Crear una reseña
    saveReview: async (reviewData) => {
        const response = await api.post('/reviews', reviewData)
        return response.data
    },

    // Actualizar reseña existente
    updateReview: async (reviewId, reviewData) => {
        const response = await api.put(`/reviews/${reviewId}`, reviewData)
        return response.data
    },

    // Eliminar reseña
    deleteReview: async (reviewId) => {
        const response = await api.delete(`/reviews/${reviewId}`)
        return response.data
    },
}

export default reviewService