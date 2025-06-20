import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function PhotoGallery({ sessionId }) {
  const [photoIds, setPhotoIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [zoomPhoto, setZoomPhoto] = useState(null)
  const [selectedPhotos, setSelectedPhotos] = useState(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)

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

  const handlePhotoClick = (photoId) => {
    if (isSelectionMode) {
      togglePhotoSelection(photoId)
    } else {
      setZoomPhoto(photoId)
    }
  }

  const handlePhotoLongPress = (photoId) => {
    setIsSelectionMode(true)
    togglePhotoSelection(photoId)
  }

  const togglePhotoSelection = (photoId) => {
    const newSelected = new Set(selectedPhotos)
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId)
    } else {
      newSelected.add(photoId)
    }
    setSelectedPhotos(newSelected)
    
    if (newSelected.size === 0) {
      setIsSelectionMode(false)
    }
  }

  const handleSelectAll = () => {
    if (selectedPhotos.size === photoIds.length) {
      setSelectedPhotos(new Set())
      setIsSelectionMode(false)
    } else {
      setSelectedPhotos(new Set(photoIds))
    }
  }

  const handleDownloadSelected = () => {
    selectedPhotos.forEach(photoId => {
      const url = `http://localhost:8080/api/photos/download/${photoId}`
      const link = document.createElement('a')
      link.href = url
      link.download = `photo_${photoId}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  const exitSelectionMode = () => {
    setIsSelectionMode(false)
    setSelectedPhotos(new Set())
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading photos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-gray-600 text-lg">Error loading photos: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (photoIds.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-blue-500 hover:text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-xl font-medium text-gray-900">Photos</h1>
            </div>
          </div>
        </header>
        
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📷</div>
            <p className="text-gray-500 text-lg">No photos found for this session</p>
            <Link 
              to={`/upload/${sessionId}`}
              className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Upload Photos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          {isSelectionMode ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={exitSelectionMode}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <span className="text-lg font-medium text-gray-900">
                  {selectedPhotos.size} selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {selectedPhotos.size === photoIds.length ? 'Deselect All' : 'Select All'}
                </button>
                <button
                  onClick={handleDownloadSelected}
                  disabled={selectedPhotos.size === 0}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Download ({selectedPhotos.size})
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/" className="text-blue-500 hover:text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </Link>
                <h1 className="text-xl font-medium text-gray-900">Photos</h1>
                <span className="text-sm text-gray-500">({photoIds.length} photos)</span>
              </div>
              <Link 
                to={`/upload/${sessionId}`}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Photos
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Photo Grid */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1">
          {photoIds.map((photoId) => (
            <PhotoTile
              key={photoId}
              photoId={photoId}
              isSelected={selectedPhotos.has(photoId)}
              isSelectionMode={isSelectionMode}
              onClick={() => handlePhotoClick(photoId)}
              onLongPress={() => handlePhotoLongPress(photoId)}
            />
          ))}
        </div>
      </main>

      {/* Zoom Modal */}
      {zoomPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={`http://localhost:8080/api/photos/download/${zoomPhoto}`}
              alt="Zoomed photo"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            {/* Close button */}
            <button
              onClick={() => setZoomPhoto(null)}
              className="absolute top-6 right-6 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Download button */}
            <button
              onClick={() => {
                const url = `http://localhost:8080/api/photos/download/${zoomPhoto}`
                const link = document.createElement('a')
                link.href = url
                link.download = `photo_${zoomPhoto}.jpg`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }}
              className="absolute bottom-6 right-6 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>

            {/* Navigation arrows */}
            <button
              onClick={() => {
                const currentIndex = photoIds.indexOf(zoomPhoto)
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : photoIds.length - 1
                setZoomPhoto(photoIds[prevIndex])
              }}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => {
                const currentIndex = photoIds.indexOf(zoomPhoto)
                const nextIndex = currentIndex < photoIds.length - 1 ? currentIndex + 1 : 0
                setZoomPhoto(photoIds[nextIndex])
              }}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Separate component for photo tiles
function PhotoTile({ photoId, isSelected, isSelectionMode, onClick, onLongPress }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [touchTimer, setTouchTimer] = useState(null)

  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      onLongPress()
    }, 500) // 500ms for long press
    setTouchTimer(timer)
  }

  const handleTouchEnd = () => {
    if (touchTimer) {
      clearTimeout(touchTimer)
      setTouchTimer(null)
    }
  }

  return (
    <div
      className={`
        relative aspect-square cursor-pointer group overflow-hidden rounded-sm
        ${isSelected ? 'ring-4 ring-blue-500' : ''}
        ${isSelectionMode ? 'transform scale-95' : 'hover:shadow-lg'}
        transition-all duration-200
      `}
      onClick={onClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      {/* Loading placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      <img
        src={`http://localhost:8080/api/photos/download/${photoId}`}
        alt="Event photo"
        className={`
          w-full h-full object-cover transition-all duration-300
          ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          ${!isSelectionMode ? 'group-hover:scale-105' : ''}
        `}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
      />

      {/* Selection overlay */}
      {isSelectionMode && (
        <div className="absolute inset-0 bg-black bg-opacity-20">
          <div className="absolute top-2 right-2">
            <div className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center
              ${isSelected 
                ? 'bg-blue-500 border-blue-500' 
                : 'bg-white bg-opacity-80 border-gray-300'
              }
            `}>
              {isSelected && (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hover overlay for non-selection mode */}
      {!isSelectionMode && (
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
      )}
    </div>
  )
}

export default PhotoGallery