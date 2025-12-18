import { useEffect, useState} from 'react';
import movieService from '../services/movieService'
import MovieCard from '../components/movies/MovieCard.jsx';
import GenreFilter from '../components/common/GenreFilter'
import useAuthStore from '../stores/useAuthStore'

function Movies() {
    const [movies, setMovies] = useState([])
    const [genres, setGenres] = useState([])
    const [selectedGenre, setSelectedGenre] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    useEffect(() => {
        loadGenres()
    }, [])

    useEffect(() => {
        loadMovies()
    }, [selectedGenre])

    const loadGenres = async () => {
        try {
            const data = await movieService.getGenres()
            setGenres(data.genres || [])
        } catch (err) {
            console.error('Error loading genres:', err)
        }
    }

    const loadMovies = async () => {
        try {
            setLoading(true)
            let data
            if (selectedGenre) {
                data = await movieService.discover(selectedGenre)
            } else {
                data = await movieService.getPopular()
            }
            setMovies(data.results || [])
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

    if (loading && movies.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando películas...</p>
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
                        onClick={loadMovies}
                        className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* Header con Título y Filtro */}
            {/* <h1 className="text-4xl font-bold mb-8">Películas Populares</h1>*/}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold">Películas Populares</h1>

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
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>

            {movies.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">
                        No se encontraron películas para este género
                    </p>
                </div>
            )}
        </div>
    )
}

export default Movies