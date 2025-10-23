import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

function PhotoUpload({ extraPhotos = [] }) {
  const { sessionId } = useParams() 
  const [name, setName] = useState('')
  const [photos, setPhotos] = useState([])

  const allPhotos = [...photos, ...extraPhotos]

  const handleFileChange = (e) => setPhotos([...e.target.files])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!sessionId) {
      alert('Session ID unavailable!')
      return
    }

    if (!name || allPhotos.length === 0) {
      alert('Please enter your name and select photos')
      return
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('sessionId', sessionId)
    allPhotos.forEach((file) => formData.append('photos', file))

    try {
      const response = await fetch('http://localhost:8080/api/photos/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error('Upload failed: ' + text)
      }

      alert('Photos uploaded successfully!')
      setName('')
      setPhotos([])
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white rounded shadow"
    >
      <h2 className="text-xl mb-4 font-bold">Upload Photos</h2>

      <p className="text-gray-600 mb-2">Session ID: {sessionId}</p>

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
      />

      {allPhotos.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {allPhotos.map((file, idx) => {
            const src = file instanceof File ? URL.createObjectURL(file) : file
            return (
              <img
                key={idx}
                src={src}
                alt={`photo-${idx}`}
                className="w-24 h-24 object-cover rounded border"
              />
            )
          })}
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>
    </form>
  )
}

export default PhotoUpload
