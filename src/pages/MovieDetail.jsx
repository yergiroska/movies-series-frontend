import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiArrowLeft, FiStar, FiCalendar, FiClock, FiHeart, FiList } from 'react-icons/fi'
import { FaHeart, FaList, FaStar } from 'react-icons/fa'
import movieService from '../services/movieService'
import reviewService from '../services/reviewService'
import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '../utils/constants'
import WatchlistModal from '../components/common/WatchlistModal'
import useFavorite from '../hooks/useFavorite'
import useWatchlist from '../hooks/useWatchlist'
import ReviewModal from '../components/common/ReviewModal'
import useAuthStore from '../stores/useAuthStore'
import MovieCard from '../components/movies/MovieCard'
import useWatchlistStore from '../stores/useWatchlistStore'

function MovieDetail() {
    const { id } = useParams()
    const [movie, setMovie] = useState(null)
    const [similar, setSimilar] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [providers, setProviders] = useState(null)
    const [userReview, setUserReview] = useState(null)
    const [allReviews, setAllReviews] = useState([])


    const [showWatchlistModal, setShowWatchlistModal] = useState(false)
    const [showReviewModal, setShowReviewModal] = useState(false)

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const user = useAuthStore((state) => state.user)

    useEffect(() => {
        loadMovieDetail()
    }, [id])

    const loadMovieDetail = async () => {
        setLoading(true)
        setError(null)

        try {
            const [movieData, similarData, providersData] = await Promise.all([
                movieService.getDetail(id),
                movieService.getSimilar(id),
                movieService.getProviders(id),
            ])

            setMovie(movieData)
            setSimilar(similarData.results?.slice(0, 6) || [])

            // Obtener providers de tu país (ES = España)
            const countryProviders = providersData.results?.ES
            setProviders(countryProviders)
            // Cargar reseñas si está autenticado
            if (isAuthenticated) {
                loadReviews()
            }
        } catch (err) {
            console.error('Error loading movie:', err)
            setError('Error al cargar la película')
        } finally {
            setLoading(false)
        }
    }

    const loadReviews = async () => {
        try {
            // Cargar reseña del usuario
            const myReview = await reviewService.getUserReview('movie', id)
            setUserReview(myReview)

            // Cargar todas las reseñas
            const allReviewsData = await reviewService.getAllReviews('movie', id)
            //console.log(allReviewsData)
            // Filtrar para no mostrar la del usuario en "Principales reseñas"
            const otherReviews = allReviewsData.reviews.filter(
                review => review.user_id !== user?.id
            )
            setAllReviews(otherReviews)
        } catch (err) {
            console.error('Error cargando reseñas:', err)
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

                                {/* Estado - Solo si existe */}
                                {watchlistItem?.status && (
                                    <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                                Estado: {watchlistItem.status === 'completed' ? 'Vista' :
                                         watchlistItem.status === 'watching' ? 'Viendo' : 'Por Ver'}
                            </span>
                                )}
                            </div>
                        )}


                        {/* Buttons */}
                        {isAuthenticated && (
                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={toggleFavorite}
                                    disabled={favoriteLoading}
                                    className="p-2 hover:bg-gray-800 rounded-lg transition disabled:opacity-50"
                                    title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                                >
                                    {isFavorite ? (
                                            <FaHeart className="text-red-500 text-2xl" />
                                    ) : (
                                            <FiHeart className="text-gray-400 hover:text-red-500 text-2xl" />
                                    )}
                                </button>

                                <button
                                    onClick={() => setShowWatchlistModal(true)}
                                    disabled={watchlistLoading}
                                    className="p-2 hover:bg-gray-800 rounded-lg transition disabled:opacity-50"
                                    title={isInWatchlist ? "Editar en mi lista" : "Agregar a mi lista"}
                                >
                                    {isInWatchlist ? (
                                            <FaList className="text-blue-500 text-2xl" />
                                    ) : (
                                            <FiList className="text-gray-400 hover:text-blue-500 text-2xl" />
                                    )}
                                </button>

                                {/* Reseña */}
                                <button
                                    onClick={() => setShowReviewModal(true)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition text-sm ${
                                        userReview
                                            ? 'bg-green-600 hover:bg-green-700 text-white'
                                            : 'bg-gray-800 hover:bg-gray-700 text-white'
                                    }`}
                                    title={userReview ? 'Editar tu reseña' : 'Agregar reseña'}
                                >
                                    <span>{userReview ? 'Mi Reseña' : 'Reseña'}</span>
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

                        {/* Where to Watch */}
                        {isAuthenticated ? (
                        <>
                        {providers && (providers.flatrate || providers.rent || providers.buy) && (
                            <div className="mt-8">
                                <h2 className="text-2xl font-bold mb-4">Dónde Ver</h2>

                                {/* Streaming */}
                                {providers.flatrate && providers.flatrate.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-400 mb-3">Streaming</h3>
                                        <div className="flex flex-wrap gap-4">
                                            {providers.flatrate.map((provider) => (
                                                <a
                                                key={provider.provider_id}
                                                href={providers.link || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group relative"
                                                title={provider.provider_name}
                                                >
                                                <img
                                                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                alt={provider.provider_name}
                                                className="w-16 h-16 rounded-lg shadow-lg group-hover:scale-110 transition-transform"
                                                />
                                                </a>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {/* Rent */}
                                {providers.rent && providers.rent.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-400 mb-3">Alquilar</h3>
                                        <div className="flex flex-wrap gap-4">
                                            {providers.rent.map((provider) => (
                                                <a
                                                key={provider.provider_id}
                                                href={providers.link || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group relative"
                                                title={provider.provider_name}
                                                >
                                                <img
                                                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                alt={provider.provider_name}
                                                className="w-16 h-16 rounded-lg shadow-lg group-hover:scale-110 transition-transform"
                                                />
                                                </a>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {/* Buy */}
                                {providers.buy && providers.buy.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-400 mb-3">Comprar</h3>
                                        <div className="flex flex-wrap gap-4">
                                            {providers.buy.map((provider) => (
                                                <a
                                                key={provider.provider_id}
                                                href={providers.link || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group relative"
                                                title={provider.provider_name}
                                                >
                                                <img
                                                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                alt={provider.provider_name}
                                                className="w-16 h-16 rounded-lg shadow-lg group-hover:scale-110 transition-transform"
                                                />
                                                </a>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        </>
                        ) : (
                            <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
                                <h2 className="text-2xl font-bold mb-4">Dónde Ver</h2>
                                <p className="text-gray-400 mb-4">
                                    Inicia sesión para ver dónde está disponible esta película
                                </p>
                                <Link
                                    to="/login"
                                    className="inline-block bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition"
                                >
                                    Iniciar Sesión
                                </Link>
                            </div>
                        )}

                        {/* Reseñas - Usuario actual + Otros usuarios */}
                        {isAuthenticated && (userReview || allReviews.length > 0) && (
                            <div className="mt-8 bg-gray-800 p-6 rounded-lg">
                                <style>{`
                                    .reviews-container::-webkit-scrollbar {
                                        width: 6px;
                                    }
                                    .reviews-container::-webkit-scrollbar-track {
                                        background: #1F2937;
                                        border-radius: 10px;
                                    }
                                    .reviews-container::-webkit-scrollbar-thumb {
                                        background: #4B5563;
                                        border-radius: 10px;
                                    }
                                    .reviews-container::-webkit-scrollbar-thumb:hover {
                                        background: #6B7280;
                                    }
                                `}</style>

                                <h2 className="text-2xl font-bold mb-6">Principales reseñas</h2>

                                <div
                                    className={`reviews-container space-y-6 pr-2 ${
                                        (userReview ? 1 : 0) + allReviews.length > 4
                                            ? 'max-h-[400px] overflow-y-auto'
                                            : ''
                                    }`}
                                >
                                    {/* Mi Reseña primero */}
                                    {userReview && (
                                        <div className="border-b border-gray-700 pb-6">
                                            {/* Usuario y puntuación */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-4">
                                                    {/* Mi nombre */}
                                                    <span className="text-gray-400 text-sm font-semibold">
                                                    {user?.name || 'Tú'} (Tú)
                                                    </span>

                                                        {/* Estado si existe */}
                                                    {/*{watchlistItem?.status && (
                                                        <span className="bg-blue-600 px-2 py-0.5 rounded-full text-xs">
                                                            Estado: {watchlistItem.status === 'completed' ? 'Vista' :
                                                                                    watchlistItem.status === 'watching' ? 'Viendo' : 'Por Ver'}
                                                        </span>
                                                            )}*/}

                                                    {/* Puntuación */}
                                                    {userReview.rating && (
                                                        <div className="flex items-center space-x-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FaStar
                                                                    key={i}
                                                                    className={i < userReview.rating ? 'text-yellow-500 text-sm' : 'text-gray-600 text-sm'}
                                                                />
                                                            ))}
                                                            <span className="text-yellow-500 font-semibold text-sm ml-1">
                                                                {userReview.rating}.0/5
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Botón Editar */}
                                                <button
                                                    onClick={() => setShowReviewModal(true)}
                                                    className="text-blue-500 hover:text-blue-400 transition text-sm"
                                                >
                                                    Editar reseña
                                                </button>
                                            </div>

                                            {/* Mi Reseña */}
                                            {userReview.review && (
                                                <p className="text-gray-300 leading-relaxed text-sm">
                                                    {userReview.review}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Reseñas de otros usuarios */}
                                    {allReviews.map((review) => (
                                        <div key={review.id} className="border-b border-gray-700 pb-6 last:border-b-0 last:pb-0">
                                            {/* Usuario y puntuación */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-4">
                                                    {/* Nombre del usuario */}
                                                    <span className="text-gray-400 text-sm">
                                                        {review.user?.name || 'Usuario'}
                                                    </span>

                                                    {/* Puntuación */}
                                                    {review.rating && (
                                                        <div className="flex items-center space-x-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FaStar
                                                                    key={i}
                                                                    className={i < review.rating ? 'text-yellow-500 text-sm' : 'text-gray-600 text-sm'}
                                                                />
                                                            ))}
                                                            <span className="text-yellow-500 font-semibold text-sm ml-1">
                                                                {review.rating}.0/5
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Fecha */}
                                                <span className="text-gray-500 text-xs">
                                                    {new Date(review.created_at).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            {/* Reseña */}
                                            {review.review && (
                                                <p className="text-gray-300 leading-relaxed text-sm">
                                                    {review.review}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Similar Movies */}
                {similar.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">Películas Similares</h2>
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

            {/* Review Modal */}
            {movie && (
                <ReviewModal
                    isOpen={showReviewModal}
                    onClose={() => {
                        setShowReviewModal(false)
                        loadReviews() // Recargar reseñas al cerrar
                    }}
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