import React, { useState } from 'react'
import QRCode from 'qrcode'

export default function QrGenerator() {
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  const generateQrCode = async () => {
    const response = await fetch('http://localhost:8080/api/qrcode', {
      method: 'POST',
    })
    const session = await response.json()
    const qrUrl = await QRCode.toDataURL(session.qrCode)
    setQrCodeUrl(qrUrl)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        onClick={generateQrCode}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Generate QR Code
      </button>
      {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" />}
    </div>
  )
}
