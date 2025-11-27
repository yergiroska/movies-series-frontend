import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from './stores/useAuthStore'
import MainLayout from './layouts/MainLayout'

// Páginas (las crearemos después)
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Movies from './pages/Movies'
import TVShows from './pages/TVShows'
import Favorites from './pages/Favorites'
import Watchlist from './pages/Watchlist'
import Search from './pages/Search'
import Profile from './pages/Profile'
import MovieDetail from './pages/MovieDetail'
import TVDetail from './pages/TVDetail'

function App() {
    const initialize = useAuthStore((state) => state.initialize)

    // Inicializar auth desde localStorage
    useEffect(() => {
        initialize()
    }, [initialize])

    return (
        <MainLayout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/tv" element={<TVShows />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/search" element={<Search />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/movies/:id" element={<MovieDetail />} />
                <Route path="/tv/:id" element={<TVDetail />} />
            </Routes>
        </MainLayout>
    )
}

export default App