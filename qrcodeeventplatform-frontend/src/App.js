import React from 'react'
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom'

import Home from './components/Home'
import SessionList from './components/SessionList'
import PhotoGallery from './components/PhotoGallery'
import UploadWithCamera from './components/UploadWithCamera'

function GalleryWrapper() {
  const { sessionId } = useParams()
  return <PhotoGallery sessionId={sessionId} />
}

function App() {
  function GalleryWrapper() {
    const { sessionId } = useParams()
    return <PhotoGallery sessionId={sessionId} />
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sessions" element={<SessionList />} />
        <Route path="/upload/:sessionId" element={<UploadWithCamera />} />
        <Route path="/gallery/:sessionId" element={<GalleryWrapper />} />
      </Routes>
    </Router>
  )
}
export default App
