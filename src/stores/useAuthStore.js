import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            // Estado
            user: null,
            token: null,
            isAuthenticated: false,

            // Acciones
            setAuth: (user, token) => {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                set({ user, token, isAuthenticated: true });
            },

            setUser: (user) => {
                localStorage.setItem('user', JSON.stringify(user));
                set({ user });
            },

            logout: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                set({ user: null, token: null, isAuthenticated: false });
            },

            // Inicializar desde localStorage
            initialize: () => {
                const token = localStorage.getItem('token');
                const userStr = localStorage.getItem('user');

                if (token && userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        set({ user, token, isAuthenticated: true });
                    } catch (error) {
                        console.error('Error parsing user:', error);
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }
                }
            },
        }),
        {
            name: 'auth-storage', // nombre en localStorage
        }
    )
);

export default useAuthStore;