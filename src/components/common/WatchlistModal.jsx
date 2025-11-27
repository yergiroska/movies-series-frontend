import { useState, useEffect } from 'react'
import { FiX, FiStar } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import useWatchlistStore from '../../stores/useWatchlistStore'

function WatchlistModal({ isOpen, onClose, tmdbId, mediaType, title, posterPath }) {
    const { getWatchlistItem, addToWatchlist, updateWatchlistItem } = useWatchlistStore()

    const existingItem = getWatchlistItem(mediaType, tmdbId)

    const [status, setStatus] = useState('plan_to_watch')
    const [userRating, setUserRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (existingItem) {
            setStatus(existingItem.status || 'plan_to_watch')
            setUserRating(existingItem.user_rating || 0)
            setNotes(existingItem.notes || '')
        } else {
            setStatus('plan_to_watch')
            setUserRating(0)
            setNotes('')
        }
    }, [existingItem, isOpen])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (existingItem) {
                // Actualizar existente
                await updateWatchlistItem(existingItem.id, {
                    status,
                    user_rating: userRating > 0 ? userRating : null,
                    notes: notes.trim() || null,
                })
            } else {
                // Crear nuevo
                await addToWatchlist({
                    tmdb_id: tmdbId,
                    media_type: mediaType,
                    title,
                    poster_path: posterPath,
                    status,
                    user_rating: userRating > 0 ? userRating : null,
                    notes: notes.trim() || null,
                })
            }
            onClose()
        } catch (err) {
            setError('Error al guardar en la lista')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    const statusOptions = [
        { value: 'plan_to_watch', label: 'Por Ver' },
        { value: 'watching', label: 'Viendo' },
        { value: 'completed', label: 'Vista' },
    ]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                        {existingItem ? 'Editar en Mi Lista' : 'Agregar a Mi Lista'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <FiX className="text-2xl" />
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Estado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Estado
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {statusOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setStatus(option.value)}
                                    className={`px-4 py-2 rounded-lg transition ${
                                        status === option.value
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Puntuación */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
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

                    {/* Notas/Reseña */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Tus Notas (opcional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Escribe tu opinión, reseña o notas personales..."
                            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={4}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
                        >
                            {loading ? 'Guardando...' : existingItem ? 'Actualizar' : 'Agregar'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default WatchlistModal