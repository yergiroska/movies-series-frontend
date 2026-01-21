import { useState, useEffect } from 'react'
import { FiX } from 'react-icons/fi'
import useWatchlistStore from '../../stores/useWatchlistStore'

function WatchlistModal({ isOpen, onClose, tmdbId, mediaType, title, posterPath }) {
    const { getWatchlistItem, addToWatchlist, updateWatchlistItem, removeFromWatchlist } = useWatchlistStore()

    const existingItem = getWatchlistItem(mediaType, tmdbId)

    const [status, setStatus] = useState('plan_to_watch')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (existingItem) {
            setStatus(existingItem.status || 'plan_to_watch')
        } else {
            setStatus('plan_to_watch')
        }
    }, [existingItem, isOpen])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (existingItem) {
                // Actualizar estado existente
                await updateWatchlistItem(existingItem.id, {
                    status,
                })
            } else {
                // Crear nuevo (sin estado por defecto)
                await addToWatchlist({
                    tmdb_id: tmdbId,
                    media_type: mediaType,
                    title,
                    poster_path: posterPath,
                    status: null, // Sin estado al agregar desde películas
                })
            }
            onClose()
            window.location.reload()
        } catch (err) {
            setError('Error al guardar en la lista')
        } finally {
            setLoading(false)
        }
    }

    const handleRemove = async () => {
        if (!existingItem) return

        if (!confirm('¿Estás seguro de eliminar esta película de tu lista?')) return

        setLoading(true)
        try {
            await removeFromWatchlist(existingItem.id)
            onClose()
            window.location.reload()
        } catch (err) {
            setError('Error al eliminar de la lista')
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                        {existingItem ? 'Editar Estado' : 'Agregar a Mi Lista'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Estado */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Estado
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {statusOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setStatus(option.value)}
                                    className={`px-4 py-3 rounded-lg font-medium transition ${
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

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
                        >
                            {loading ? 'Guardando...' : existingItem ? 'Actualizar' : 'Agregar'}
                        </button>

                        {existingItem && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                disabled={loading}
                                className="px-6 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
                            >
                                Eliminar
                            </button>
                        )}

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