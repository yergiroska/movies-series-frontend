import { FiFilter } from 'react-icons/fi'

function GenreFilter({ genres, selectedGenre, onGenreChange, isLoading }) {
    const selectedGenreName = genres.find(g => g.id === selectedGenre)?.name || 'Todos'

    return (
        <div className="flex items-center space-x-3">
            <FiFilter className="text-xl text-gray-400" />
            <span className="text-gray-400 font-medium">Género:</span>
            <select
                value={selectedGenre || ''}
                onChange={(e) => onGenreChange(e.target.value ? parseInt(e.target.value) : null)}
                disabled={isLoading}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer disabled:opacity-50"
            >
                <option value="">Todos</option>
                {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                        {genre.name}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default GenreFilter