import { useState, useEffect } from 'react'
import tvService from '../services/tvService'
import TVCard from '../components/tv/TVCard'

function TVShows() {
    const [shows, setShows] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadShows()
    }, [])

    const loadShows = async () => {
        try {
            setLoading(true)
            const data = await tvService.getPopular()
            setShows(data.results || [])
            setError(null)
        } catch (err) {
            console.error('Error loading TV shows:', err)
            setError('Error al cargar las series')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando series...</p>
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
                        onClick={loadShows}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Series Populares</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {shows.map((show) => (
                    <TVCard key={show.id} show={show} />
                ))}
            </div>
        </div>
    )
}

export default TVShows