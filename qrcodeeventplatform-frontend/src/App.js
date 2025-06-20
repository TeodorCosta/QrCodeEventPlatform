import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from 'react-router-dom'

import Home from './components/Home' 
import PhotoUpload from './components/PhotoUpload'
import PhotoGallery from './components/PhotoGallery'
import SessionList from './components/SessionList'

function UploadWrapper() {
  const { sessionId } = useParams()
  return <PhotoUpload sessionId={sessionId} />
}

function GalleryWrapper() {
  const { sessionId } = useParams()
  return <PhotoGallery sessionId={sessionId} />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload/:sessionId" element={<UploadWrapper />} />
        <Route path="/gallery/:sessionId" element={<GalleryWrapper />} />
        <Route path="/sessions" element={<SessionList />} />
      </Routes>
    </Router>
  )
}

export default App
