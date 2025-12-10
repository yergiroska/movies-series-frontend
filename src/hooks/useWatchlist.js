import { useState } from 'react'
import useWatchlistStore from '../stores/useWatchlistStore'
import useAuthStore from '../stores/useAuthStore'

function useWatchlist(tmdbId, mediaType, title, posterPath) {
    const [loading, setLoading] = useState(false)

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const isInWatchlist = useWatchlistStore((state) =>
        state.isInWatchlist(mediaType, tmdbId)
    )
    const toggleWatchlistInStore = useWatchlistStore((state) => state.toggleWatchlist)

    const toggleWatchlist = async () => {
        if (!isAuthenticated) {
            alert('Debes iniciar sesión para agregar a tu lista')
            return
        }

        console.log('Sending to watchlist:', {
            tmdb_id: tmdbId,
            media_type: mediaType,
            title: title,
            poster_path: posterPath,
        })

        setLoading(true)
        try {
            await toggleWatchlistInStore({
                tmdb_id: tmdbId,
                media_type: mediaType,
                title: title,
                poster_path: posterPath,
                status: 'plan_to_watch',
            })
        } catch (error) {
            console.error('Error toggling watchlist:', error)
            console.error('Error response:', error.response?.data)
            console.error('Error details:', error.response?.data?.errors)
            alert('Error al actualizar lista')
        } finally {
            setLoading(false)
        }
    }

    return { isInWatchlist, loading, toggleWatchlist }
}

export default useWatchlist