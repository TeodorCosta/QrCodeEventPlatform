import React, { useRef, useState } from 'react'

function CameraCapture({ onCapture }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [streaming, setStreaming] = useState(false)
  const [capturedPhotos, setCapturedPhotos] = useState([])

  const startCamera = async () => {
    if (!videoRef.current) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.current.srcObject = stream
      await videoRef.current.play()
      setStreaming(true)
    } catch (err) {
      alert('Error accessing camera: ' + err.message)
    }
  }

  const takePhoto = () => {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], `photo-${Date.now()}.png`, { type: 'image/png' })
      const url = URL.createObjectURL(file)

  
      setCapturedPhotos((prev) => [...prev, url])

      if (onCapture) onCapture(file)
    }, 'image/png')
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop())
      setStreaming(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow mb-4">
      <h2 className="text-xl mb-2 font-bold">Camera</h2>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full mb-2 rounded border bg-black"
      />

      <div className="mb-2">
        {!streaming ? (
          <button
            onClick={startCamera}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Start Camera
          </button>
        ) : (
          <>
            <button
              onClick={takePhoto}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
            >
              Take Photo
            </button>
            <button
              onClick={stopCamera}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Stop Camera
            </button>
          </>
        )}
      </div>

      {capturedPhotos.length > 0 && (
        <div className="mb-2">
          <h3 className="font-semibold mb-1">Captured Photos:</h3>
          <div className="flex flex-wrap gap-2">
            {capturedPhotos.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`captured-${idx}`}
                className="w-24 h-24 object-cover rounded border"
              />
            ))}
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

export default CameraCapture
