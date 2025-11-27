import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import movieService from '../services/movieService'
import tvService from '../services/tvService'
import MovieCard from '../components/movies/MovieCard'
import TVCard from '../components/tv/TVCard'
import { FiSearch } from 'react-icons/fi'

function Search() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get('query')

    const [movies, setMovies] = useState([])
    const [tvShows, setTVShows] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (query) {
            searchContent()
        }
    }, [query])

    const searchContent = async () => {
        setLoading(true)
        setError(null)

        try {
            const [moviesData, tvData] = await Promise.all([
                movieService.search(query),
                tvService.search(query)
            ])

            setMovies(moviesData.results || [])
            setTVShows(tvData.results || [])
        } catch (err) {
            console.error('Error searching:', err)
            setError('Error al buscar contenido')
        } finally {
            setLoading(false)
        }
    }

    if (!query) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <FiSearch className="text-6xl text-gray-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Busca películas y series</h2>
                    <p className="text-gray-400">Usa la barra de búsqueda para encontrar contenido</p>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-400">Buscando "{query}"...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-red-500 text-xl mb-4">{error}</p>
                    <button
                        onClick={searchContent}
                        className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    const totalResults = movies.length + tvShows.length

    if (totalResults === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <FiSearch className="text-6xl text-gray-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No se encontraron resultados</h2>
                    <p className="text-gray-400 mb-6">
                        No hay resultados para "<span className="text-white">{query}</span>"
                    </p>
                    <div className="space-x-4">
                        <Link
                            to="/movies"
                            className="inline-block bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition"
                        >
                            Ver Películas
                        </Link>
                        <Link
                            to="/tv"
                            className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition"
                        >
                            Ver Series
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    Resultados de búsqueda
                </h1>
                <p className="text-gray-400">
                    {totalResults} resultado{totalResults !== 1 ? 's' : ''} para "<span className="text-white">{query}</span>"
                </p>
            </div>

            {movies.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Películas ({movies.length})</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                </div>
            )}

            {tvShows.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-6">Series ({tvShows.length})</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {tvShows.map((show) => (
                            <TVCard key={show.id} show={show} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Search