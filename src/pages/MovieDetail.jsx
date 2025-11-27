import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiArrowLeft, FiStar, FiCalendar, FiClock, FiHeart, FiList } from 'react-icons/fi'
import { FaHeart, FaList, FaStar } from 'react-icons/fa'
import movieService from '../services/movieService'
import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '../utils/constants'
import WatchlistModal from '../components/common/WatchlistModal'
import useFavorite from '../hooks/useFavorite'
import useWatchlist from '../hooks/useWatchlist'
import useAuthStore from '../stores/useAuthStore'
import MovieCard from '../components/movies/MovieCard'
import useWatchlistStore from '../stores/useWatchlistStore'

function MovieDetail() {
    const { id } = useParams()
    const [movie, setMovie] = useState(null)
    const [similar, setSimilar] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [showWatchlistModal, setShowWatchlistModal] = useState(false)

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    useEffect(() => {
        loadMovieDetail()
    }, [id])

    const loadMovieDetail = async () => {
        setLoading(true)
        setError(null)

        try {
            const [movieData, similarData] = await Promise.all([
                movieService.getDetail(id),
                movieService.getSimilar(id)
            ])

            setMovie(movieData)
            setSimilar(similarData.results?.slice(0, 6) || [])
        } catch (err) {
            console.error('Error loading movie:', err)
            setError('Error al cargar la película')
        } finally {
            setLoading(false)
        }
    }

    const { isFavorite, loading: favoriteLoading, toggleFavorite } = useFavorite(
        movie?.id,
        'movie',
        movie?.title,
        movie?.poster_path,
        movie?.overview
    )

    const { isInWatchlist, loading: watchlistLoading, toggleWatchlist } = useWatchlist(
        movie?.id,
        'movie',
        movie?.title,
        movie?.poster_path
    )

    const watchlistItem = useWatchlistStore((state) => state.getWatchlistItem('movie', movie?.id))

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando...</p>
                </div>
            </div>
        )
    }

    if (error || !movie) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-500 text-xl mb-4">{error || 'Película no encontrada'}</p>
                    <Link to="/movies" className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition">
                        Volver a Películas
                    </Link>
                </div>
            </div>
        )
    }

    const backdropUrl = movie.backdrop_path
        ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.backdrop}${movie.backdrop_path}`
        : null

    const posterUrl = movie.poster_path
        ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.poster}${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image'

    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'
    const runtime = movie.runtime ? `${movie.runtime} min` : 'N/A'

    return (
        <div>
            {/* Backdrop */}
            {backdropUrl && (
                <div className="relative -mt-8 mb-8">
                    <div className="h-96 overflow-hidden">
                        <img
                            src={backdropUrl}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="container mx-auto px-4 -mt-32 relative z-10">
                <Link
                    to="/movies"
                    className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition"
                >
                    <FiArrowLeft />
                    <span>Volver a Películas</span>
                </Link>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Poster */}
                    <div className="flex-shrink-0">
                        <img
                            src={posterUrl}
                            alt={movie.title}
                            className="w-64 rounded-lg shadow-2xl"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
                            <div className="flex items-center space-x-2">
                                <FiCalendar />
                                <span>{year}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FiClock />
                                <span>{runtime}</span>
                            </div>
                            {movie.vote_average > 0 && (
                                <div className="flex items-center space-x-2 text-yellow-500">
                                    <FiStar className="fill-current" />
                                    <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                                </div>
                            )}
                        </div>

                        {/* Genres */}
                        {movie.genres && movie.genres.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {movie.genres.map((genre) => (
                                    <span
                                        key={genre.id}
                                        className="bg-gray-800 px-3 py-1 rounded-full text-sm"
                                    >
                    {genre.name}
                  </span>
                                ))}
                            </div>
                        )}

                        {/* Buttons */}
                        {isAuthenticated && (
                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={toggleFavorite}
                                    disabled={favoriteLoading}
                                    className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 px-6 py-3 rounded-lg transition"
                                >
                                    {isFavorite ? (
                                        <>
                                            <FaHeart className="text-red-500" />
                                            <span>En Favoritos</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiHeart />
                                            <span>Agregar a Favoritos</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => setShowWatchlistModal(true)}
                                    disabled={watchlistLoading}
                                    className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 px-6 py-3 rounded-lg transition"
                                >
                                    {isInWatchlist ? (
                                        <>
                                            <FaList className="text-blue-500" />
                                            <span>Editar en Mi Lista</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiList />
                                            <span>Agregar a Mi Lista</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Overview */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Sinopsis</h2>
                            <p className="text-gray-300 leading-relaxed">
                                {movie.overview || 'No hay sinopsis disponible.'}
                            </p>
                        </div>

                        {/* Mi Reseña */}
                        {watchlistItem && (
                            <div className="mt-8 bg-gray-800 p-6 rounded-lg">
                                <h2 className="text-2xl font-bold mb-4">Mi Reseña</h2>

                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-400">Estado:</span>
                                        <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                                          {watchlistItem.status === 'completed' ? 'Vista' :
                                              watchlistItem.status === 'watching' ? 'Viendo' : 'Por Ver'}
                                        </span>
                                    </div>

                                    {watchlistItem.user_rating && (
                                        <div className="flex items-center space-x-2">
                                            <span className="text-gray-400">Mi Puntuación:</span>
                                            <div className="flex items-center space-x-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        className={i < watchlistItem.user_rating ? 'text-yellow-500' : 'text-gray-600'}
                                                    />
                                                ))}
                                                <span className="text-yellow-500 font-bold ml-2">
                                                  {watchlistItem.user_rating}/5
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {watchlistItem.notes && (
                                    <div>
                                        <span className="text-gray-400 block mb-2">Mis Notas:</span>
                                        <p className="text-gray-300 leading-relaxed">{watchlistItem.notes}</p>
                                    </div>
                                )}

                                <button
                                    onClick={() => setShowWatchlistModal(true)}
                                    className="mt-4 text-blue-500 hover:text-blue-400 transition"
                                >
                                    Editar reseña
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Similar Movies */}
                {similar.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">Películas Similaresholaaaaaaa</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {similar.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Watchlist Modal */}
            {movie && (
                <WatchlistModal
                    isOpen={showWatchlistModal}
                    onClose={() => setShowWatchlistModal(false)}
                    tmdbId={movie.id}
                    mediaType="movie"
                    title={movie.title}
                    posterPath={movie.poster_path}
                />
            )}
        </div>
    )
}

export default MovieDetail