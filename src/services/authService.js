import api from './api';

const authService = {
    // Registro
    register: async (name, email, password, password_confirmation) => {
        const response = await api.post('/register', {
            name,
            email,
            password,
            password_confirmation,
        });
        return response.data;
    },

    // Login
    login: async (email, password) => {
        const response = await api.post('/login', {
            email,
            password,
        });
        return response.data;
    },

    // Logout
    logout: async () => {
        const response = await api.post('/logout');
        return response.data;
    },

    // Obtener usuario actual
    getUser: async () => {
        const response = await api.get('/user');
        return response.data;
    },

    // Actualizar perfil
    updateProfile: async (data) => {
        const response = await api.put('/profile', data);
        return response.data;
    },

    // Cambiar contraseña
    updatePassword: async (current_password, new_password, new_password_confirmation) => {
        const response = await api.put('/profile/password', {
            current_password,
            new_password,
            new_password_confirmation,
        });
        return response.data;
    },
};

export default authService;