import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import CameraCapture from './CameraCapture'
import PhotoUpload from './PhotoUpload'

function UploadWithCamera() {
  const { sessionId } = useParams() 
  const [cameraPhotos, setCameraPhotos] = useState([])

  const handleCameraCapture = (file) => {
    setCameraPhotos((prev) => [...prev, file])
  }

  return (
    <div>
      <CameraCapture onCapture={handleCameraCapture} />
      <PhotoUpload sessionId={sessionId} extraPhotos={cameraPhotos} />
    </div>
  )
}

export default UploadWithCamera