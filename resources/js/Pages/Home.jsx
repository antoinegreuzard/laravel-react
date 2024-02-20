import { useState, useEffect } from 'react'
import axios from 'axios'

function StarBrowser() {
    const [stars, setStars] = useState([])
    const [activeStarIndex, setActiveStarIndex] = useState(0)

    useEffect(() => {
        const fetchStars = async () => {
            try {
                const response = await axios.get('/api/stars')
                setStars(response.data)
                if (response.data.length > 0) setActiveStarIndex(0)
            } catch (error) {
                console.error('Error fetching stars:', error)
            }
        }
        fetchStars()
    }, [])

    const selectedStar = stars[activeStarIndex]

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Head equivalent in React */}
            <nav className="bg-white shadow mb-6">
                {/* Navigation content */}
            </nav>
            <div className="py-12">
                <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                    <div className="sm:flex p-6 sm:p-8">
                        <div className="sm:w-64 flex-shrink-0">
                            <ul className="space-y-1">
                                {stars.map((star, index) => (
                                    <li
                                        key={star.id}
                                        onClick={() =>
                                            setActiveStarIndex(index)
                                        }
                                        className={`cursor-pointer p-2 hover:bg-gray-300 rounded-md ${
                                            index === activeStarIndex
                                                ? 'bg-gray-500 text-white'
                                                : ''
                                        }`}
                                    >
                                        {star.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {selectedStar && (
                            <div className="flex-1 p-4 space-y-4">
                                <h2 className="text-xl font-bold">
                                    {selectedStar.name}{' '}
                                    {selectedStar.first_name}
                                </h2>
                                <img
                                    src={selectedStar.image}
                                    alt="Star Image"
                                    className="w-full max-w-xs rounded-lg shadow-md"
                                />
                                <p>{selectedStar.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StarBrowser
