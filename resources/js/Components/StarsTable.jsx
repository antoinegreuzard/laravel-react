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

    const escapeHtml = unsafe => {
        if (typeof unsafe !== 'string') {
            return unsafe
        }

        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
    }

    const sanitizeInput = input => {
        return escapeHtml(input)
    }

    function sanitizeUrl(url) {
        const pattern = /^(https?:\/\/)/i
        if (pattern.test(url)) {
            return encodeURI(url)
        }
        return 'about:blank'
    }

    const resetForm = () => {
        setStarForm({
            name: '',
            first_name: '',
            image: null,
            description: '',
        })
        setEditingStar(null)
        setShowCreateForm(false)
        setShowEditForm(false)
    }

    const fetchStars = async () => {
        try {
            const response = await axios.get('/api/stars')
            setStars(
                response.data.map(star => ({
                    ...star,
                    name: sanitizeInput(star.name),
                    first_name: sanitizeInput(star.first_name),
                    description: sanitizeInput(star.description),
                }))
            )
        } catch (error) {
            console.error('There was an error fetching the stars:', error)
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
        Object.keys(starForm).forEach(key => {
            if (key === 'image') {
                formData.append(key, starForm[key])
            } else {
                formData.append(key, sanitizeInput(starForm[key]))
            }
        })

        try {
            const response = await axios.post('/api/stars', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            })
            setStars([...stars, response.data])
            resetForm()
        } catch (error) {
            console.error(
                'There was an error creating the star:',
                error.response?.data
            )
        }
    }

    const handleSubmitEdit = async () => {
        if (!editingStar || editingStar.id === undefined) return

        const formData = new FormData()
        formData.append('name', editingStar.name)
        formData.append('first_name', editingStar.first_name)
        formData.append('description', editingStar.description)

        // Ajouter l'image seulement si elle a été modifiée.
        if (editingStar.image instanceof File) {
            formData.append('image', editingStar.image)
        }

        formData.append('_method', 'PUT')

        try {
            const response = await axios.post(
                `/api/stars/${editingStar.id}`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                }
            )

            setStars(
                stars.map(star =>
                    star.id === editingStar.id ? response.data : star
                )
            )
            resetForm()
        } catch (error) {
            console.error('There was an error updating the star:', error)
        }
    }

    const prepareEditStar = star => {
        setEditingStar(star)
        setShowEditForm(true)
    }

    const handleDeleteStar = async id => {
        try {
            await axios.delete(`/api/stars/${id}`)
            setStars(stars.filter(star => star.id !== id))
        } catch (error) {
            console.error('There was an error deleting the star:', error)
        }
    }

    const cancelEdit = () => {
        resetForm()
    }

    useEffect(() => {
        fetchStars()
    }, [])

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <button
                type="button"
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition ease-in-out duration-150"
            >
                Add a star
            </button>

            {showCreateForm && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-inner">
                    {/* Form inputs for creation */}
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
                            type="button"
                            onClick={handleSubmitCreate}
                            className="btn bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Create
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="btn bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {showEditForm && editingStar && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-inner">
                    {/* Form inputs for editing */}
                    <input
                        type="text"
                        value={editingStar.name}
                        onChange={e =>
                            setEditingStar({
                                ...editingStar,
                                name: e.target.value,
                            })
                        }
                        className="input w-full mb-3 px-4 py-2 border rounded shadow-sm"
                        placeholder="Name"
                    />
                    <input
                        type="text"
                        value={editingStar.first_name}
                        onChange={e =>
                            setEditingStar({
                                ...editingStar,
                                first_name: e.target.value,
                            })
                        }
                        className="input w-full mb-3 px-4 py-2 border rounded shadow-sm"
                        placeholder="Firstname"
                    />
                    {editingStar.image && (
                        <div className="mb-3">
                            {/* Display image if exists */}
                            <img
                                src={sanitizeUrl(editingStar.image)}
                                alt="Preview"
                                className="w-32 h-auto rounded"
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        className="input w-full mb-3 px-4 py-2 border rounded shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <textarea
                        value={editingStar.description}
                        onChange={e =>
                            setEditingStar({
                                ...editingStar,
                                description: e.target.value,
                            })
                        }
                        className="textarea w-full mb-3 px-4 py-2 border rounded shadow-sm"
                        placeholder="Description"
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={handleSubmitEdit}
                            className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={cancelEdit}
                            className="btn bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto mt-6">
                <table className="w-full text-left rounded-lg overflow-hidden">
                    <thead className="bg-gray-200 uppercase text-gray-600">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">First Name</th>
                            <th className="px-4 py-3">Image</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stars.map(star => (
                            <tr
                                key={star.id}
                                className="border-b odd:bg-white even:bg-gray-50"
                            >
                                <td className="px-4 py-3">{star.name}</td>
                                <td className="px-4 py-3">{star.first_name}</td>
                                <td className="px-4 py-3">
                                    <img
                                        src={star.image}
                                        alt="Star"
                                        className="w-12 h-auto rounded-full"
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    {star.description}
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={() => prepareEditStar(star)}
                                        className="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteStar(star.id)
                                        }
                                        className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default StarManager
