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
            set({ watchlist: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Agregar a watchlist
    addToWatchlist: async (mediaData) => {
        set({ isLoading: true, error: null });
        try {
            const newItem = await watchlistService.add(mediaData);
            set((state) => ({
                watchlist: [...state.watchlist, newItem],
                isLoading: false,
            }));
            return newItem;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    // Actualizar item (status, rating, notes)
    updateWatchlistItem: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const updatedItem = await watchlistService.update(id, data);
            set((state) => ({
                watchlist: state.watchlist.map((item) =>
                    item.id === id ? updatedItem : item
                ),
                isLoading: false,
            }));
            return updatedItem;
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

    // Limpiar estado
    clearWatchlist: () => {
        set({ watchlist: [], error: null });
    },
}));

export default useWatchlistStore;