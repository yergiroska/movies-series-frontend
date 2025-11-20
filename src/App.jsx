import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from './stores/useAuthStore'

// Páginas (las crearemos después)
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Movies from './pages/Movies'
import TVShows from './pages/TVShows'

function App() {
    const initialize = useAuthStore((state) => state.initialize)

    // Inicializar auth desde localStorage
    useEffect(() => {
        initialize()
    }, [initialize])

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/tv" element={<TVShows />} />
            </Routes>
        </div>
    )
}

export default App