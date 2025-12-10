import Navbar from '../components/common/Navbar'

function MainLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
                <div className="container mx-auto px-4 py-6 text-center text-gray-400">
                    <p>Movies & Series Platform © 2025</p>
                </div>
            </footer>
        </div>
    )
}

export default MainLayout