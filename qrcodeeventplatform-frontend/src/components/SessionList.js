// src/components/SessionList.jsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function SessionList() {
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    fetch('http://localhost:8080/api/qrcode/qrsessions')
      .then((response) => response.json())
      .then((data) => setSessions(data))
      .catch((error) => console.error('Error fetching sessions:', error))
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Available QR Sessions</h1>
      <ul className="space-y-2">
        {sessions.map((session) => (
          <li key={session.id}>
            <Link
              to={`/gallery/${session.id}`}
              className="text-blue-500 underline"
            >
              Session {session.id} - {session.qrCode}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SessionList
