import React, { useEffect, useState } from 'react'

function PhotoGallery({ sessionId }) {
  const [photoIds, setPhotoIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [zoomPhoto, setZoomPhoto] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch(`http://localhost:8080/api/photos/session/${sessionId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then((data) => {
        setPhotoIds(data)
        setLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
      })
  }, [sessionId])

  if (loading) return <p className="text-center p-4">Loading photos...</p>
  if (error)
    return <p className="text-center p-4 text-red-600">Error: {error}</p>
  if (photoIds.length === 0)
    return <p className="text-center p-4">No photos found for this session.</p>

  const handleDownload = (photoId) => {
    const url = `http://localhost:8080/api/photos/download/${photoId}`
    const link = document.createElement('a')
    link.href = url
    link.download = `photo_${photoId}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <div className="p-2 max-w-7xl mx-auto">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1">
          {photoIds.map((photoId) => (
            <div
              key={photoId}
              className="relative cursor-pointer group overflow-hidden bg-gray-100"
              style={{
                aspectRatio: '1',
                width: '100%'
              }}
              onClick={() => setZoomPhoto(photoId)}
            >
              <img
                src={`http://localhost:8080/api/photos/download/${photoId}`}
                alt="Event Photo"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
              />
              {/* Download button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownload(photoId)
                }}
                className="absolute top-1 right-1 bg-black bg-opacity-60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                title="Download photo"
                aria-label="Download photo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v8m0 0l-4-4m4 4l4-4M12 4v8"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Zoom modal */}
      {zoomPhoto && (
        <div
          onClick={() => setZoomPhoto(null)}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 cursor-zoom-out p-4"
        >
          <img
            src={`http://localhost:8080/api/photos/download/${zoomPhoto}`}
            alt="Zoomed Event Photo"
            className="max-w-full max-h-full rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setZoomPhoto(null)}
            className="absolute top-6 right-6 text-white bg-black bg-opacity-60 rounded-full p-2 hover:bg-opacity-80 focus:outline-none"
            aria-label="Close zoomed photo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}

export default PhotoGallery