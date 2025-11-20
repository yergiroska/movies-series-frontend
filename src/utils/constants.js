// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// TMDB Image Base URL
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

// Image Sizes
export const IMAGE_SIZES = {
    poster: 'w500',
    backdrop: 'w1280',
    profile: 'w185',
    small: 'w200',
    medium: 'w500',
    large: 'original',
};

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    MOVIES: '/movies',
    MOVIE_DETAIL: '/movies/:id',
    TV_SHOWS: '/tv',
    TV_DETAIL: '/tv/:id',
    FAVORITES: '/favorites',
    WATCHLIST: '/watchlist',
    PROFILE: '/profile',
    SEARCH: '/search',
};

// Media Types
export const MEDIA_TYPES = {
    MOVIE: 'movie',
    TV: 'tv',
};

// Watchlist Status
export const WATCHLIST_STATUS = {
    WATCHING: 'watching',
    COMPLETED: 'completed',
    PLAN_TO_WATCH: 'plan_to_watch',
};