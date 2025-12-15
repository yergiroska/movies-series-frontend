function Avatar({ name, size = 'md' }) {
    const getInitials = (name) => {
        if (!name) return '??'
        const parts = name.trim().split(' ')
        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase()
        }
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }

    const getColorFromName = (name) => {
        if (!name) return 'bg-gray-600'

        const colors = [
            'bg-red-500',
            'bg-blue-500',
            'bg-green-500',
            'bg-yellow-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-indigo-500',
            'bg-teal-500',
            'bg-orange-500',
            'bg-cyan-500',
        ]

        let hash = 0
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash)
        }

        return colors[Math.abs(hash) % colors.length]
    }

    const sizeClasses = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-16 h-16 text-2xl',
        xl: 'w-24 h-24 text-4xl',
        '2xl': 'w-32 h-32 text-5xl',
    }

    const initials = getInitials(name)
    const bgColor = getColorFromName(name)

    return (
        <div
            className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center font-bold text-white shadow-lg`}
        >
            {initials}
        </div>
    )
}

export default Avatar