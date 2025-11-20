import { create } from 'zustand';
import favoriteService from '../services/favoriteService';

const useFavoriteStore = create((set, get) => ({
    // Estado
    favorites: [],
    isLoading: false,
    error: null,

    // Cargar todos los favoritos
    fetchFavorites: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await favoriteService.getAll();
            set({ favorites: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Agregar a favoritos
    addFavorite: async (mediaData) => {
        set({ isLoading: true, error: null });
        try {
            const newFavorite = await favoriteService.add(mediaData);
            set((state) => ({
                favorites: [...state.favorites, newFavorite],
                isLoading: false,
            }));
            return newFavorite;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    // Eliminar favorito por TMDB ID
    removeFavorite: async (mediaType, tmdbId) => {
        set({ isLoading: true, error: null });
        try {
            await favoriteService.removeByTmdb(mediaType, tmdbId);
            set((state) => ({
                favorites: state.favorites.filter(
                    (fav) => !(fav.media_type === mediaType && fav.tmdb_id === tmdbId)
                ),
                isLoading: false,
            }));
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    // Verificar si está en favoritos
    isFavorite: (mediaType, tmdbId) => {
        const { favorites } = get();
        return favorites.some(
            (fav) => fav.media_type === mediaType && fav.tmdb_id === tmdbId
        );
    },

    // Toggle favorito
    toggleFavorite: async (mediaData) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        const { media_type, tmdb_id } = mediaData;

        if (isFavorite(media_type, tmdb_id)) {
            await removeFavorite(media_type, tmdb_id);
            return false;
        } else {
            await addFavorite(mediaData);
            return true;
        }
    },

    // Limpiar estado
    clearFavorites: () => {
        set({ favorites: [], error: null });
    },
}));

export default useFavoriteStore;