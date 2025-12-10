import { useEffect, useState} from 'react';
import movieService from '../services/movieService'
import MovieCard from '../components/movies/MovieCard.jsx';

function Movies() {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadMovies()
    }, [])

    const loadMovies = async () => {
        try {
            setLoading(true)
            const data = await movieService.getPopular()
            setMovies(data.results || [])
            setError(null)
        } catch (err) {
            console.error('Error loading movies:', err)
            setError('Error al cargar las películas')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
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
            <h1 className="text-4xl font-bold mb-8">Películas Populares</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    )
}

export default Movies