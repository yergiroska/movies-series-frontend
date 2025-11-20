function Home() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-4">
                Movies & Series Platform
            </h1>
            <p className="text-center text-gray-400">
                Bienvenido a tu plataforma de películas y series
            </p>

            <div className="mt-8 flex gap-4 justify-center">
                <a
                    href="/movies"
                    className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition"
                >
                    Ver Películas
                </a>
                <a
                    href="/tv"
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
                >
                    Ver Series
                </a>
                <a
                    href="/login"
                    className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition"
                >
                    Iniciar Sesión
                </a>
            </div>
        </div>
    )
}

export default Home