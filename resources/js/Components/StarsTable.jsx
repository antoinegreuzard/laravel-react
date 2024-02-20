import { useState, useEffect } from 'react'
import axios from 'axios'

function StarManager() {
    const [stars, setStars] = useState([])
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [starForm, setStarForm] = useState({
        name: '',
        first_name: '',
        image: null,
        description: '',
    })
    const [editingStar, setEditingStar] = useState(null)

    const fetchStars = async () => {
        try {
            const response = await axios.get('/api/stars')
            setStars(response.data)
        } catch (error) {
            console.error('There was an error fetching the stars: ', error)
        }
    }

    const handleFileUpload = event => {
        const file = event.target.files[0]
        if (showEditForm) {
            setEditingStar({ ...editingStar, image: file })
        } else {
            setStarForm({ ...starForm, image: file })
        }
    }

    const handleSubmitCreate = async () => {
        const formData = new FormData()
        formData.append('name', starForm.name)
        formData.append('first_name', starForm.first_name)
        formData.append('description', starForm.description)
        if (starForm.image) {
            formData.append('image', starForm.image)
        }

        try {
            const response = await axios.post('/api/stars', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            setStars([...stars, response.data])
            setShowCreateForm(false)
            resetForm()
        } catch (error) {
            console.error('There was an error creating the star: ', error)
        }
    }

    const handleSubmitEdit = async () => {
        if (!editingStar) return

        const formData = new FormData()
        formData.append('name', editingStar.name)
        formData.append('first_name', editingStar.first_name)
        formData.append('description', editingStar.description)
        if (editingStar.image instanceof File) {
            formData.append('image', editingStar.image)
        }

        try {
            const response = await axios.put(
                `/api/stars/${editingStar.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
            setStars(
                stars.map(star =>
                    star.id === editingStar.id ? response.data : star
                )
            )
            setShowEditForm(false)
            setEditingStar(null)
        } catch (error) {
            console.error('There was an error updating the star: ', error)
        }
    }

    const handleDeleteStar = async id => {
        try {
            await axios.delete(`/api/stars/${id}`)
            setStars(stars.filter(star => star.id !== id))
        } catch (error) {
            console.error('There was an error deleting the star: ', error)
        }
    }

    const prepareEditStar = star => {
        setEditingStar(star)
        setShowEditForm(true)
    }

    const resetForm = () => {
        setStarForm({
            name: '',
            first_name: '',
            image: null,
            description: '',
        })
    }

    const cancelEdit = () => {
        setShowEditForm(false)
        setEditingStar(null)
    }

    useEffect(() => {
        fetchStars()
    }, [])

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition ease-in-out duration-150"
            >
                Add a star
            </button>

            {showCreateForm && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-inner">
                    {/* Remplacez TextInput par des inputs standards si nécessaire */}
                    <input
                        type="text"
                        value={starForm.name}
                        onChange={e =>
                            setStarForm({ ...starForm, name: e.target.value })
                        }
                        className="input w-full mb-3 px-4 py-2 border rounded shadow-sm"
                        placeholder="Name"
                    />
                    <input
                        type="text"
                        value={starForm.first_name}
                        onChange={e =>
                            setStarForm({
                                ...starForm,
                                first_name: e.target.value,
                            })
                        }
                        className="input w-full mb-3 px-4 py-2 border rounded shadow-sm"
                        placeholder="Firstname"
                    />
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        className="input w-full mb-3 px-4 py-2 border rounded shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <textarea
                        value={starForm.description}
                        onChange={e =>
                            setStarForm({
                                ...starForm,
                                description: e.target.value,
                            })
                        }
                        className="textarea w-full mb-3 px-4 py-2 border rounded shadow-sm"
                        placeholder="Description"
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={handleSubmitCreate}
                            className="btn bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Create
                        </button>
                        <button
                            onClick={() => setShowCreateForm(false)}
                            className="btn bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StarManager
