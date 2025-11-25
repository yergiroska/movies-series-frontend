import { useState } from 'react'
import useFavoriteStore from '../stores/useFavoriteStore'
import useAuthStore from '../stores/useAuthStore'

function useFavorite(tmdbId, mediaType, title, posterPath, overview) {
    const [loading, setLoading] = useState(false)

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const isFavorite = useFavoriteStore((state) =>
        state.isFavorite(mediaType, tmdbId)
    )
    const toggleFavoriteInStore = useFavoriteStore((state) => state.toggleFavorite)

    const toggleFavorite = async () => {
        if (!isAuthenticated) {
            alert('Debes iniciar sesión para agregar favoritos')
            return
        }

        setLoading(true)
        try {
            await toggleFavoriteInStore({
                tmdb_id: tmdbId,
                media_type: mediaType,
                title: title,
                poster_path: posterPath,
                overview: overview,
            })
        } catch (error) {
            console.error('Error toggling favorite:', error)
            console.error('Error response:', error.response?.data)
            alert('Error al actualizar favoritos')
        } finally {
            setLoading(false)
        }
    }

    return { isFavorite, loading, toggleFavorite }
}

export default useFavorite