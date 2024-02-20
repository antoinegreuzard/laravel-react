import { useState, useEffect } from 'react'
import axios from 'axios'
import { Head, Link, usePage } from '@inertiajs/react'

function StarProfileBrowser() {
    const { props } = usePage()
    const [stars, setStars] = useState([])
    const [activeStarIndex, setActiveStarIndex] = useState(0)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchStars = async () => {
            try {
                const response = await axios.get('/api/stars')
                setStars(response.data)
                if (response.data.length > 0) setActiveStarIndex(0)
            } catch (errorResponse) {
                setError('Failed to fetch stars.')
            }
        }

        fetchStars()
    }, [])

    const selectedStar = stars[activeStarIndex]

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Home" />
            <nav className="bg-white shadow mb-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Link
                                href={route('home')}
                                className="text-lg font-semibold text-gray-800"
                            >
                                Profile Browser
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* eslint-disable react/prop-types */}
                            {props.auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="text-gray-800 hover:text-gray-600"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-gray-800 hover:text-gray-600"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="text-gray-800 hover:text-gray-600"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="sm:flex p-6 sm:p-8">
                            <div className="sm:w-64 flex-shrink-0">
                                <ul className="space-y-1">
                                    {stars.map((star, index) => (
                                        <button
                                            type="button"
                                            key={star.id}
                                            onClick={() =>
                                                setActiveStarIndex(index)
                                            }
                                            onKeyPress={event =>
                                                event.key === 'Enter' &&
                                                setActiveStarIndex(index)
                                            }
                                            className={`block w-full text-left cursor-pointer p-2 hover:bg-gray-300 rounded-md ${
                                                index === activeStarIndex
                                                    ? 'bg-gray-500 text-white'
                                                    : ''
                                            }`}
                                            aria-pressed={
                                                index === activeStarIndex
                                            }
                                        >
                                            {star.name}
                                        </button>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex-1 p-4">
                                {selectedStar && (
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-bold">
                                            {selectedStar.name}{' '}
                                            {selectedStar.first_name}
                                        </h2>
                                        <img
                                            src={selectedStar.image}
                                            alt={`${selectedStar.name}'s profile`}
                                            className="w-full max-w-xs rounded-lg shadow-md"
                                        />
                                        <p>{selectedStar.description}</p>
                                    </div>
                                )}
                                {error && (
                                    <p className="text-red-500">{error}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StarProfileBrowser
