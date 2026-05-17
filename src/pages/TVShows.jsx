import { useState, useEffect } from 'react'
import tvService from '../services/tvService'
import TVCard from '../components/tv/TVCard'
import GenreFilter from '../components/common/GenreFilter'
import useAuthStore from '../stores/useAuthStore'
import movieService from "../services/movieService.js";

function TVShows() {
    const [shows, setShows] = useState([])
    const [genres, setGenres] = useState([])
    const [selectedGenre, setSelectedGenre] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    useEffect(() => {
        loadGenres()
    }, [])

    useEffect(() => {
        loadShows()
    }, [selectedGenre])

    const loadGenres = async () => {
        try {
            const data = await tvService.getGenres()
            setGenres(data.genres || [])
        } catch (err) {
            console.error('Error loading genres:', err)
        }
    }

    const loadShows = async () => {
        try {
            setLoading(true)
            let data
            if (selectedGenre) {
                data = await tvService.discover(selectedGenre)
            } else {
                data = await tvService.getPopular()
            }
            setShows(data.results || [])
            setError(null)
        } catch (err) {
            console.error('Error loading movies:', err)
            setError('Error al cargar las películas')
        } finally {
            setLoading(false)
        }
    }

    const handleGenreChange = (genreId) => {
        setSelectedGenre(genreId)
    }

    /*const loadShows = async () => {
        try {
            setLoading(true)
            const data = await tvService.getPopular()
            setShows(data.results || [])
            setError(null)
        } catch (err) {
            console.error('Error loading TV shows:', err)
            setError('Error al cargar las series')
        } finally {
            setLoading(false)
        }
    }*/

    if (loading && shows.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando series...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-500 text-xl mb-4">{error}</p>
                    <button
                        onClick={loadShows}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div>
            {/*<h1 className="text-4xl font-bold mb-8">Series Populares</h1>*/}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold">Series Populares</h1>

                {/* Filtro de Géneros - Solo si está autenticado */}
                {isAuthenticated && genres.length > 0 && (
                    <GenreFilter
                        genres={genres}
                        selectedGenre={selectedGenre}
                        onGenreChange={handleGenreChange}
                        isLoading={loading}
                    />
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {shows.map((show) => (
                    <TVCard key={show.id} show={show} />
                ))}
            </div>

            {shows.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">
                        No se encontraron series para este género
                    </p>
                </div>
            )}
        </div>
    )
}

export default TVShows