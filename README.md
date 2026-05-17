# 🎬 CineVerse - Frontend

> Interfaz web moderna para descubrir, organizar y reseñar películas y series. Construida con **React 19** y **Vite**, conectada a la [CineVerse API](../cineverse-python).

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Scripts Disponibles](#scripts-disponibles)
- [Funcionalidades](#funcionalidades)
- [Páginas y Rutas](#páginas-y-rutas)

---

## Descripción

CineVerse Frontend es una SPA (Single Page Application) estilo Netflix que permite a los usuarios explorar películas y series usando datos en tiempo real de **TMDB API**, gestionar sus favoritos, lista de seguimiento y reseñas personales.

El backend (FastAPI + PostgreSQL) está disponible en: [cineverse-python](../cineverse-python)

---

## Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | Framework UI |
| Vite | 7 | Build tool y servidor de desarrollo |
| React Router | v7 | Navegación y rutas |
| Zustand | 5 | Estado global |
| Axios | — | Peticiones HTTP con interceptors |
| Tailwind CSS | 3 | Estilos y diseño responsive |
| React Icons | 5 | Iconografía (Feather + Font Awesome) |

---

## Estructura del Proyecto

```
src/
├── components/
│   ├── common/
│   │   ├── Navbar.jsx            # Barra de navegación con búsqueda
│   │   ├── Avatar.jsx            # Avatar con iniciales y color único
│   │   ├── GenreFilter.jsx       # Filtro desplegable por género
│   │   ├── WatchlistModal.jsx    # Modal de estados de watchlist
│   │   └── ReviewModal.jsx       # Modal de reseñas con estrellas
│   ├── movies/
│   │   └── MovieCard.jsx         # Card con acciones (favorito, lista, reseña)
│   └── tv/
│       └── TVCard.jsx
├── pages/
│   ├── Home.jsx                  # Carrusel + collage destacados
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Movies.jsx                # Grid con filtro por género
│   ├── TVShows.jsx               # Grid de series populares
│   ├── Search.jsx                # Búsqueda global películas + series
│   ├── Favorites.jsx             # Favoritos separados por tipo
│   ├── Watchlist.jsx             # Lista separada por tipo
│   ├── Profile.jsx               # Perfil, estadísticas y seguridad
│   ├── MovieDetail.jsx           # Detalle completo con reseñas y providers
│   └── TVDetail.jsx
├── services/
│   ├── api.js                    # Axios + interceptors JWT
│   ├── authService.js
│   ├── movieService.js
│   ├── tvService.js
│   ├── favoriteService.js
│   ├── watchlistService.js
│   ├── reviewService.js
│   └── searchService.js
├── stores/
│   ├── useAuthStore.js           # Usuario y token
│   ├── useFavoriteStore.js       # Estado global de favoritos
│   └── useWatchlistStore.js      # Estado global de watchlist
├── hooks/
│   ├── useFavorite.js            # Toggle favorito con estado local
│   └── useWatchlist.js           # Toggle watchlist con estado local
├── layouts/
│   └── MainLayout.jsx
└── utils/
    └── constants.js              # URLs de imágenes TMDB
```

---

## Instalación

### Requisitos previos

- Node.js 18+
- Backend CineVerse API corriendo en `http://localhost:8000`

### Pasos

**1. Clonar el repositorio**

```bash
git clone https://github.com/yergiroska/movies-series-frontend.git
cd movies-series-frontend
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Configurar variables de entorno**

```bash
cp .env.example .env
# Editar .env con tus valores
```

**4. Iniciar servidor de desarrollo**

```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`

---

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8000/api
```

---

## Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo (http://localhost:5173)
npm run build      # Build de producción
npm run preview    # Preview del build
npm run lint       # Linter de código
```

---

## Funcionalidades

### 🔐 Autenticación
- Registro e inicio de sesión con JWT
- Persistencia de sesión en localStorage
- Rutas protegidas para usuarios autenticados
- Avatar con iniciales y color único generado por nombre

### 🎬 Películas y 📺 Series
- Grid responsive de contenido popular
- Página de detalle con backdrop, sinopsis, géneros y duración
- Contenido similar al pie de cada detalle
- Filtro por género (solo usuarios autenticados)

### 🔍 Búsqueda Global
- Barra de búsqueda siempre visible en el Navbar
- Resultados simultáneos de películas y series
- Separación visual por tipo de contenido

### ❤️ Favoritos
- Toggle desde cards y páginas de detalle
- Ícono activo con fondo rojo y animación pulse
- Página dedicada separada por películas y series

### 📋 Watchlist
- Estados de seguimiento: Por Ver, Viendo, Vista
- Badge azul de estado visible en cards y detalle
- Ícono activo con fondo azul y animación pulse
- Página dedicada separada por tipo

### ⭐ Reseñas
- Puntuación de 1 a 5 estrellas
- Texto de reseña hasta 2000 caracteres
- Sección "Principales reseñas" en cada detalle con scroll personalizado
- La reseña propia aparece destacada al inicio

### 🎥 Plataformas de Streaming
- Logos clicables de Netflix, HBO, Disney+ y más
- Secciones: Streaming, Alquilar, Comprar
- Datos por país (España por defecto)
- Visible solo para usuarios autenticados

### 👤 Perfil
- Estadísticas de favoritos, lista, películas y series
- Edición de nombre y email
- Cambio de contraseña

### 🏠 Página de Inicio
- Carrusel automático de 8 items con cambio cada 5 segundos
- Navegación manual con flechas y dots
- Backdrop dinámico por item activo
- CTA de registro para usuarios no autenticados

---

## Páginas y Rutas

| Ruta | Página | Auth |
|---|---|---|
| `/` | Home — carrusel y destacados | No |
| `/login` | Inicio de sesión | No |
| `/register` | Crear cuenta | No |
| `/movies` | Listado de películas | No |
| `/movies/:id` | Detalle de película | No |
| `/tv` | Listado de series | No |
| `/tv/:id` | Detalle de serie | No |
| `/search` | Búsqueda global | No |
| `/favorites` | Mis favoritos | Sí |
| `/watchlist` | Mi lista | Sí |
| `/profile` | Mi perfil | Sí |

---

*Desarrollado por [Yergiroska](https://github.com/yergiroska) — Barcelona, España 🇪🇸*