import { Link, useNavigate } from 'react-router-dom'
import { FiFilm, FiTv, FiHeart, FiList, FiUser, FiLogOut, FiLogIn, FiSearch } from 'react-icons/fi'
import { useState} from "react";
import useAuthStore from '../../stores/useAuthStore'
import authService from '../../services/authService'

function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [searchOpen, setSearchOpen] = useState(false)

    const handleLogout = async () => {
        try {
            await authService.logout()
            logout()
            navigate('/login')
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
            logout()
            navigate('/login')
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`)
            setSearchQuery('')
            setSearchOpen(false)
        }
    }

    const toggleSearch = () => {
        setSearchOpen(!searchOpen)
        if (!searchOpen) {
            // Focus en el input cuando se abre
            setTimeout(() => {
                document.getElementById('search-input')?.focus()
            }, 100)
        }
    }

    return (
        <nav className="bg-gray-800 border-b border-gray-700">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <FiFilm className="text-red-500 text-2xl" />
                        <span className="text-xl font-bold text-white">Movies - Series Platform</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            to="/movies"
                            className="flex items-center space-x-1 text-gray-300 hover:text-white transition"
                        >
                            <FiFilm />
                            <span>Películas</span>
                        </Link>

                        <Link
                            to="/tv"
                            className="flex items-center space-x-1 text-gray-300 hover:text-white transition"
                        >
                            <FiTv />
                            <span>Series</span>
                        </Link>

                        {isAuthenticated && (
                            <>
                                <Link
                                    to="/favorites"
                                    className="flex items-center space-x-1 text-gray-300 hover:text-white transition"
                                >
                                    <FiHeart />
                                    <span>Favoritos</span>
                                </Link>

                                <Link
                                    to="/watchlist"
                                    className="flex items-center space-x-1 text-gray-300 hover:text-white transition"
                                >
                                    <FiList />
                                    <span>Mi Lista</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Search Bar */}<form onSubmit={handleSearch} className="hidden md:block">
                    <div className="relative flex items-center">
                        <FiSearch className="absolute left-3 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Títulos, personas, géneros"
                            className="bg-gray-700 text-white pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-72"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 text-gray-400 hover:text-white transition"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </form>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition"
                                >
                                    <FiUser />
                                    <span className="hidden md:inline">{user?.name}</span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-gray-300 hover:text-red-500 transition"
                                >
                                    <FiLogOut />
                                    <span className="hidden md:inline">Salir</span>
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                            >
                                <FiLogIn />
                                <span>Iniciar Sesión</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar