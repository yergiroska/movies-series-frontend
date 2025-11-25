import { Link } from 'react-router-dom'
import { FiStar } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '../../utils/constants'
import useFavorite from '../../hooks/useFavorite'
import useAuthStore from '../../stores/useAuthStore'

function MovieCard({ movie }) {
    const posterUrl = movie.poster_path
        ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.poster}${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image'

    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const { isFavorite, loading, toggleFavorite } = useFavorite(
        movie.id,
        'movie',
        movie.title,
        movie.poster_path,
        movie.overview
    )

    const handleFavoriteClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite()
    }

    return (
        <Link
            to={`/movies/${movie.id}`}
            className="group relative block overflow-hidden rounded-lg bg-gray-800 transition-transform hover:scale-105"
        >
            {/* Poster */}
            <div className="aspect-[2/3] overflow-hidden">
                <img
                    src={posterUrl}
                    alt={movie.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                    loading="lazy"
                />
            </div>

            {/* Info Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white line-clamp-2 mb-2">
                        {movie.title}
                    </h3>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">{year}</span>

                        {movie.vote_average > 0 && (
                            <div className="flex items-center space-x-1 text-yellow-500">
                                <FiStar className="fill-current" />
                                <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Rating Badge (always visible) */}
            {movie.vote_average > 0 && (
                <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded-md flex items-center space-x-1">
                    <FiStar className="text-yellow-500 fill-current text-sm" />
                    <span className="text-white text-sm font-semibold">
            {movie.vote_average.toFixed(1)}
          </span>
                </div>
            )}

            {/* Favorite Button */}
            {isAuthenticated && (
                <button
                    onClick={handleFavoriteClick}
                    disabled={loading}
                    className="absolute top-2 left-2 transition disabled:opacity-50"
                    /* className="absolute top-2 left-2 bg-black/80 hover:bg-black p-2 rounded-full transition disabled:opacity-50" */
                    title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                    {isFavorite ? (
                        <FaHeart className="text-red-500 text-lg" />
                    ) : (
                        <FaHeart className="text-white text-lg" />
                    )}
                </button>
            )}
        </Link>
    )
}

export default MovieCard