import { useState, useEffect } from 'react'
import { FiX, FiStar } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import reviewService from '../../services/reviewService'
import useAuthStore from '../../stores/useAuthStore'

function ReviewModal({ isOpen, onClose, tmdbId, mediaType, title, posterPath }) {
    const user = useAuthStore((state) => state.user)

    const [userRating, setUserRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(false)
    const [loadingReview, setLoadingReview] = useState(true)
    const [error, setError] = useState('')
    const [existingReview, setExistingReview] = useState(null)

    // Cargar reseña existente si hay
    useEffect(() => {
        const loadExistingReview = async () => {
            if (!isOpen) return

            setLoadingReview(true)
            try {
                const review = await reviewService.getUserReview(mediaType, tmdbId)
                if (review) {
                    setExistingReview(review)
                    setUserRating(review.rating || 0)
                    setNotes(review.review || '')
                } else {
                    setExistingReview(null)
                    setUserRating(0)
                    setNotes('')
                }
            } catch (err) {
                console.error('Error cargando reseña:', err)
            } finally {
                setLoadingReview(false)
            }
        }

        loadExistingReview()
    }, [isOpen, mediaType, tmdbId])

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validación: debe haber al menos puntuación O reseña
        if (userRating === 0 && !notes.trim()) {
            setError('Debes agregar al menos una puntuación o una reseña')
            return
        }

        setError('')
        setLoading(true)

        try {
            if (existingReview) {
                // ACTUALIZAR reseña existente (PUT)
                // Permitir enviar review como null si está vacío
                await reviewService.updateReview(existingReview.id, {
                    rating: userRating > 0 ? userRating : null,
                    review: notes.trim() || null,  // null si está vacío
                })
            } else {
                // CREAR nueva reseña (POST)
                await reviewService.saveReview({
                    user_id: user.id,
                    tmdb_id: tmdbId,
                    media_type: mediaType,
                    title: title,
                    poster_path: posterPath,
                    rating: userRating > 0 ? userRating : null,
                    review: notes.trim() || null,
                })
            }

            onClose()
            //window.location.reload()
        } catch (err) {
            setError(existingReview ? 'Error al actualizar la reseña' : 'Error al guardar la reseña')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!existingReview) return

        if (!confirm('¿Estás seguro de eliminar esta reseña?')) return

        setLoading(true)
        try {
            await reviewService.deleteReview(existingReview.id)
            onClose()
            //window.location.reload()
        } catch (err) {
            setError('Error al eliminar la reseña')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                        {existingReview ? 'Editar Reseña' : 'Agregar Reseña'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {loadingReview ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* Puntuación */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Tu Puntuación
                            </label>
                            <div className="flex items-center space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setUserRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="transition-transform hover:scale-125"
                                    >
                                        {star <= (hoverRating || userRating) ? (
                                            <FaStar className="text-yellow-500 text-3xl" />
                                        ) : (
                                            <FiStar className="text-gray-600 text-3xl" />
                                        )}
                                    </button>
                                ))}
                                {userRating > 0 && (
                                    <span className="text-yellow-500 font-bold text-xl ml-2">
                    {userRating}/5
                  </span>
                                )}
                            </div>
                            {userRating > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setUserRating(0)}
                                    className="text-sm text-gray-400 hover:text-white mt-2"
                                >
                                    Limpiar puntuación
                                </button>
                            )}
                        </div>

                        {/* Notas */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Tu Reseña (opcional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Escribe tu opinión, reseña o notas personales..."
                                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                rows={5}
                                maxLength={2000}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                {notes.length}/2000 caracteres
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
                            >
                                {loading
                                    ? (existingReview ? 'Actualizando...' : 'Guardando...')
                                    : (existingReview ? 'Actualizar' : 'Guardar')
                                }
                            </button>

                            {existingReview && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition"
                                >
                                    Eliminar
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default ReviewModal