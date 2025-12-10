import { create } from 'zustand';
import watchlistService from '../services/watchlistService';
import { WATCHLIST_STATUS } from '../utils/constants';

const useWatchlistStore = create((set, get) => ({
    // Estado
    watchlist: [],
    isLoading: false,
    error: null,

    // Cargar toda la watchlist
    fetchWatchlist: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await watchlistService.getAll();
            set({ watchlist: data.watchlist || [], isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Agregar a watchlist
    addToWatchlist: async (mediaData) => {
        console.log('Store addToWatchlist received:', mediaData);  // ← AGREGAR
        set({ isLoading: true, error: null });
        try {
            const response = await watchlistService.add({
                tmdb_id: parseInt(mediaData.tmdb_id),
                media_type: mediaData.media_type,
                title: mediaData.title,
                poster_path: mediaData.poster_path || null,
                status: mediaData.status || 'plan_to_watch',
                user_rating: mediaData.user_rating || null,
                notes: mediaData.notes || null,
            });

            console.log('Response from backend:', response);
            set((state) => ({
                watchlist: [...state.watchlist, response.watchlist],
                isLoading: false,
            }));
            return response.watchlist;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    // Actualizar item (status, rating, notes)
    updateWatchlistItem: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await watchlistService.update(id, data);
            set((state) => ({
                watchlist: state.watchlist.map((item) =>
                    item.id === id ? response.watchlist : item
                ),
                isLoading: false,
            }));
            return response.watchlist;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    // Eliminar de watchlist
    removeFromWatchlist: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await watchlistService.remove(id);
            set((state) => ({
                watchlist: state.watchlist.filter((item) => item.id !== id),
                isLoading: false,
            }));
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    // Verificar si está en watchlist
    isInWatchlist: (mediaType, tmdbId) => {
        const { watchlist } = get();
        return watchlist.some(
            (item) => item.media_type === mediaType && item.tmdb_id === tmdbId
        );
    },

    // Obtener item por TMDB ID
    getWatchlistItem: (mediaType, tmdbId) => {
        const { watchlist } = get();
        return watchlist.find(
            (item) => item.media_type === mediaType && item.tmdb_id === tmdbId
        );
    },

    // Filtrar por estado
    getByStatus: (status) => {
        const { watchlist } = get();
        return watchlist.filter((item) => item.status === status);
    },

    // Toggle watchlist
    toggleWatchlist: async (mediaData) => {
        const { isInWatchlist, addToWatchlist, getWatchlistItem, removeFromWatchlist } = get();
        const { media_type, tmdb_id } = mediaData;

        if (isInWatchlist(media_type, tmdb_id)) {
            const item = getWatchlistItem(media_type, tmdb_id);
            await removeFromWatchlist(item.id);
            return false;
        } else {
            await addToWatchlist(mediaData);
            return true;
        }
    },

    // Limpiar estado
    clearWatchlist: () => {
        set({ watchlist: [], error: null });
    },
}));

export default useWatchlistStore;