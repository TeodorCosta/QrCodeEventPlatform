import React, { useState } from 'react'

function PhotoUpload({ sessionId }) {
  const [name, setName] = useState('')
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e) => {
    setPhotos(e.target.files)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || photos.length === 0) {
      alert('Please enter your name and select photos')
      return
    }
    setUploading(true)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('sessionId', sessionId)

    for (const file of photos) {
      formData.append('photos', file)
    }

    try {
      const response = await fetch('http://localhost:8080/api/photos/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      alert('Photos uploaded successfully!')
      setName('')
      setPhotos([])
    } catch (err) {
      alert(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white rounded shadow"
    >
      <h2 className="text-xl mb-4 font-bold">Upload Photos</h2>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="w-full mb-4"
        required
      />
      <button
        type="submit"
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  )
}

export default PhotoUpload
