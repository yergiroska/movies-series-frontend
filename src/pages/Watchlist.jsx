import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useWatchlistStore from '../stores/useWatchlistStore'
import MovieCard from '../components/movies/MovieCard'
import TVCard from '../components/tv/TVCard'

function Watchlist() {
    const { watchlist, isLoading, fetchWatchlist } = useWatchlistStore()

    useEffect(() => {
        fetchWatchlist()
    }, [fetchWatchlist])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando mi lista...</p>
                </div>
            </div>
        )
    }

    if (watchlist.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Tu lista está vacía</h2>
                    <p className="text-gray-400 mb-6">
                        Agrega películas y series para verlas más tarde
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

    const movies = watchlist.filter(item => item.media_type === 'movie')
    const tvShows = watchlist.filter(item => item.media_type === 'tv')

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Mi Lista</h1>

            {movies.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Películas ({movies.length})</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {movies.map((movie) => (
                            <MovieCard
                                key={`${movie.media_type}-${movie.tmdb_id}`}
                                movie={{
                                    id: movie.tmdb_id,
                                    title: movie.title,
                                    poster_path: movie.poster_path,
                                    overview: '',
                                    vote_average: 0,
                                    release_date: ''
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {tvShows.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-6">Series ({tvShows.length})</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {tvShows.map((show) => (
                            <TVCard
                                key={`${show.media_type}-${show.tmdb_id}`}
                                show={{
                                    id: show.tmdb_id,
                                    name: show.title,
                                    poster_path: show.poster_path,
                                    overview: '',
                                    vote_average: 0,
                                    first_air_date: ''
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Watchlist