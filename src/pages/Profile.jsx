import { useState, useEffect } from 'react'
import { FiUser, FiMail, FiLock, FiEdit2, FiSave, FiX } from 'react-icons/fi'
import useAuthStore from '../stores/useAuthStore'
import authService from '../services/authService'
import useFavoriteStore from '../stores/useFavoriteStore'
import useWatchlistStore from '../stores/useWatchlistStore'
import Avatar from '../components/common/Avatar'

function Profile() {
    const { user, setUser } = useAuthStore()
    const favorites = useFavoriteStore((state) => state.favorites)
    const watchlist = useWatchlistStore((state) => state.watchlist)

    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [isEditingPassword, setIsEditingPassword] = useState(false)

    // Formulario de perfil
    const [name, setName] = useState(user?.name || '')
    const [email, setEmail] = useState(user?.email || '')
    const [profileLoading, setProfileLoading] = useState(false)
    const [profileError, setProfileError] = useState('')
    const [profileSuccess, setProfileSuccess] = useState('')

    // Formulario de contraseña
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('')
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [passwordError, setPasswordError] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState('')

    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
        }
    }, [user])

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setProfileError('')
        setProfileSuccess('')
        setProfileLoading(true)

        try {
            const response = await authService.updateProfile({ name, email })
            setUser(response.user)
            setProfileSuccess('Perfil actualizado exitosamente')
            setIsEditingProfile(false)
        } catch (error) {
            setProfileError(error.response?.data?.message || 'Error al actualizar perfil')
        } finally {
            setProfileLoading(false)
        }
    }

    const handleUpdatePassword = async (e) => {
        e.preventDefault()
        setPasswordError('')
        setPasswordSuccess('')

        if (newPassword !== newPasswordConfirmation) {
            setPasswordError('Las contraseñas no coinciden')
            return
        }

        setPasswordLoading(true)

        try {
            await authService.updatePassword(currentPassword, newPassword, newPasswordConfirmation)
            setPasswordSuccess('Contraseña actualizada exitosamente')
            setCurrentPassword('')
            setNewPassword('')
            setNewPasswordConfirmation('')
            setIsEditingPassword(false)
        } catch (error) {
            setPasswordError(error.response?.data?.message || 'Error al cambiar contraseña')
        } finally {
            setPasswordLoading(false)
        }
    }

    const stats = {
        favorites: favorites.length,
        watchlist: watchlist.length,
        movies: favorites.filter(f => f.media_type === 'movie').length + watchlist.filter(w => w.media_type === 'movie').length,
        tvShows: favorites.filter(f => f.media_type === 'tv').length + watchlist.filter(w => w.media_type === 'tv').length,
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Mi Perfil</h1>
            {/* Avatar Section */}
            <div className="flex justify-center mb-8">
                <Avatar name={user?.name} size="2xl" />
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-800 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-red-500">{stats.favorites}</div>
                    <div className="text-gray-400 mt-2">Favoritos</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-500">{stats.watchlist}</div>
                    <div className="text-gray-400 mt-2">Mi Lista</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-yellow-500">{stats.movies}</div>
                    <div className="text-gray-400 mt-2">Películas</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-green-500">{stats.tvShows}</div>
                    <div className="text-gray-400 mt-2">Series</div>
                </div>
            </div>

            {/* Información del Perfil */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Información Personal</h2>
                    {!isEditingProfile && (
                        <button
                            onClick={() => setIsEditingProfile(true)}
                            className="flex items-center space-x-2 text-red-500 hover:text-red-400 transition"
                        >
                            <FiEdit2 />
                            <span>Editar</span>
                        </button>
                    )}
                </div>

                {profileSuccess && (
                    <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-4">
                        {profileSuccess}
                    </div>
                )}

                {profileError && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
                        {profileError}
                    </div>
                )}

                {isEditingProfile ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Nombre</label>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={profileLoading}
                                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-6 py-3 rounded-lg transition"
                            >
                                <FiSave />
                                <span>{profileLoading ? 'Guardando...' : 'Guardar'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditingProfile(false)
                                    setName(user?.name || '')
                                    setEmail(user?.email || '')
                                    setProfileError('')
                                    setProfileSuccess('')
                                }}
                                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition"
                            >
                                <FiX />
                                <span>Cancelar</span>
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Nombre</label>
                            <div className="text-lg">{user?.name}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                            <div className="text-lg">{user?.email}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Cambiar Contraseña */}
            <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Seguridad</h2>
                    {!isEditingPassword && (
                        <button
                            onClick={() => setIsEditingPassword(true)}
                            className="flex items-center space-x-2 text-red-500 hover:text-red-400 transition"
                        >
                            <FiLock />
                            <span>Cambiar Contraseña</span>
                        </button>
                    )}
                </div>

                {passwordSuccess && (
                    <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-4">
                        {passwordSuccess}
                    </div>
                )}

                {passwordError && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
                        {passwordError}
                    </div>
                )}

                {isEditingPassword ? (
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña Actual</label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Nueva Contraseña</label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Confirmar Nueva Contraseña</label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    value={newPasswordConfirmation}
                                    onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-6 py-3 rounded-lg transition"
                            >
                                <FiSave />
                                <span>{passwordLoading ? 'Guardando...' : 'Cambiar Contraseña'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditingPassword(false)
                                    setCurrentPassword('')
                                    setNewPassword('')
                                    setNewPasswordConfirmation('')
                                    setPasswordError('')
                                    setPasswordSuccess('')
                                }}
                                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition"
                            >
                                <FiX />
                                <span>Cancelar</span>
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="text-gray-400">
                        Haz clic en "Cambiar Contraseña" para actualizar tu contraseña
                    </p>
                )}
            </div>
        </div>
    )
}

export default Profile