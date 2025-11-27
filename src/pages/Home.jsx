import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import movieService from '../services/movieService'
import tvService from '../services/tvService'
import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '../utils/constants'

function Home() {
    const [content, setContent] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadContent()
    }, [])

    // Auto-slide cada 5 segundos
    useEffect(() => {
        if (content.length === 0) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % content.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [content.length])

    const loadContent = async () => {
        try {
            const [moviesData, showsData] = await Promise.all([
                movieService.getPopular(),
                tvService.getPopular()
            ])

            const movies = (moviesData.results?.slice(0, 4) || []).map(m => ({
                ...m,
                media_type: 'movie',
                title: m.title,
                link: `/movies/${m.id}`
            }))

            const shows = (showsData.results?.slice(0, 4) || []).map(s => ({
                ...s,
                media_type: 'tv',
                title: s.name,
                link: `/tv/${s.id}`
            }))

            // Mezclar películas y series
            const combined = [...movies, ...shows].sort(() => Math.random() - 0.5)
            setContent(combined)
        } catch (error) {
            console.error('Error loading content:', error)
        } finally {
            setLoading(false)
        }
    }

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % content.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + content.length) % content.length)
    }

    const goToSlide = (index) => {
        setCurrentIndex(index)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando contenido...</p>
                </div>
            </div>
        )
    }

    const currentItem = content[currentIndex]
    const backdropUrl = currentItem?.backdrop_path
        ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.backdrop}${currentItem.backdrop_path}`
        : null

    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Carousel */}
            <div className="relative h-[600px] overflow-hidden">
                {/* Backdrop Image */}
                {backdropUrl && (
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                        style={{ backgroundImage: `url(${backdropUrl})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
                    </div>
                )}

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
                    <div className="max-w-2xl">
            <span className="inline-block bg-red-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              {currentItem?.media_type === 'movie' ? 'PELÍCULA' : 'SERIE'}
            </span>

                        <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                            {currentItem?.title}
                        </h1>

                        <p className="text-lg text-gray-200 mb-8 line-clamp-3 drop-shadow-lg">
                            {currentItem?.overview}
                        </p>

                        <div className="flex gap-4">
                            <Link
                                to={currentItem?.link}
                                className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-lg font-semibold text-lg transition transform hover:scale-105"
                            >
                                Ver Detalles
                            </Link>
                            <Link
                                to={currentItem?.media_type === 'movie' ? '/movies' : '/tv'}
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-8 py-4 rounded-lg font-semibold text-lg transition"
                            >
                                Ver Más {currentItem?.media_type === 'movie' ? 'Películas' : 'Series'}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 p-3 rounded-full transition"
                >
                    <FiChevronLeft className="text-3xl" />
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 p-3 rounded-full transition"
                >
                    <FiChevronRight className="text-3xl" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                    {content.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all ${
                                index === currentIndex
                                    ? 'bg-red-600 w-8'
                                    : 'bg-white/50 hover:bg-white/70 w-2'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Quick Links */}
            <div className="container mx-auto px-4 py-12 flex-grow">
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <Link
                        to="/movies"
                        className="group relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-red-600 to-red-800 hover:scale-105 transition-transform"
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <h2 className="text-4xl font-bold mb-2">Películas</h2>
                                <p className="text-lg text-gray-200">Explora nuestro catálogo</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/tv"
                        className="group relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 hover:scale-105 transition-transform"
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <h2 className="text-4xl font-bold mb-2">Series</h2>
                                <p className="text-lg text-gray-200">Descubre nuevas historias</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Call to Action */}
                <section className="bg-gradient-to-r from-red-600 to-blue-600 rounded-2xl p-12 text-center">
                    <h2 className="text-4xl font-bold mb-4">
                        ¿Listo para explorar?
                    </h2>
                    <p className="text-xl text-gray-100 mb-8">
                        Crea tu cuenta y comienza a guardar tus favoritos
                    </p>
                    <Link
                        to="/register"
                        className="inline-block bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105"
                    >
                        Registrarse Gratis
                    </Link>
                </section>
            </div>
        </div>
    )
}

export default Home