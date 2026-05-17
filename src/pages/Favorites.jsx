import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useFavoriteStore from '../stores/useFavoriteStore'
import MovieCard from '../components/movies/MovieCard'
import TVCard from '../components/tv/TVCard'

function Favorites() {
    const { favorites, isLoading, fetchFavorites } = useFavoriteStore()

    useEffect(() => {
        fetchFavorites()
    }, [fetchFavorites])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando favoritos...</p>
                </div>
            </div>
        )
    }

    if (favorites.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">No tienes favoritos aún</h2>
                    <p className="text-gray-400 mb-6">
                        Explora películas y series, y agrega tus favoritas
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

    const movies = favorites.filter(f => f.media_type === 'movie')
    const tvShows = favorites.filter(f => f.media_type === 'tv')

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Mis Favoritos</h1>

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
                                    overview: movie.overview,
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
                                    overview: show.overview,
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

export default Favorites