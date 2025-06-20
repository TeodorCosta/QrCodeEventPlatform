import React, { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Link } from 'react-router-dom'

function Home() {
  const [qrCodeValue, setQrCodeValue] = useState('')

  const generateQrCode = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/qrcode', {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to generate QR Code')

      const data = await response.json()
      setQrCodeValue(data.qrCode) // Ensure your backend sends { qrCode: 'someValue' }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to generate QR Code')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-5xl font-extrabold mb-4 animate-pulse">
        QR Code Event Platform
      </h1>
      <p className="text-xl mb-8 text-center max-w-xl">
        Easily generate QR codes for events. Allow users to scan, upload photos
        for 24 hours, and securely manage access.
      </p>

      <button
        onClick={generateQrCode}
        className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-2xl shadow-lg hover:bg-blue-100 transition duration-300"
      >
        Generate QR Code
      </button>

      {qrCodeValue && (
        <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center">
          <QRCodeCanvas value={qrCodeValue} size={256} />
          <p className="mt-4 text-blue-600 text-center break-all">
            {qrCodeValue}
          </p>

          <Link
            to={`/upload/${qrCodeValue}`}
            className="mt-4 text-white bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Go to Photo Upload
          </Link>
        </div>
      )}

      <Link
        to="/sessions"
        className="mt-12 text-white underline hover:text-blue-200 transition"
      >
        View All QR Sessions
      </Link>
    </div>
  )
}

export default Home
