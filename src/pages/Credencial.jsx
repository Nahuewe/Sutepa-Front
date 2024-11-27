import React, { useState } from 'react'

export const Credencial = () => {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)

  // Manejar la subida de la imagen
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)

      // Crear una URL para previsualizar la imagen
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Descargar la credencial
  const handleDownload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 400 // Ajustar tamaño
    canvas.height = 250

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Añadir texto a la credencial
    ctx.fillStyle = '#000'
    ctx.font = '16px Arial'
    ctx.fillText('Nombre: John Doe', 20, 30)
    ctx.fillText('ID: 123456', 20, 60)

    // Dibujar la imagen si existe
    if (preview) {
      const img = new Image()
      img.src = preview
      img.onload = () => {
        ctx.drawImage(img, 20, 80, 100, 100) // Posición y tamaño de la imagen
        descargarCanvas(canvas)
      }
    } else {
      descargarCanvas(canvas)
    }
  }

  // Función para descargar el canvas como imagen
  const descargarCanvas = (canvas) => {
    const link = document.createElement('a')
    link.download = 'credencial.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Crear Credencial</h1>
      <p>Sube una foto y genera tu credencial</p>

      {/* Campo para subir la imagen */}
      <input
        type='file'
        accept='image/*'
        onChange={handleImageUpload}
        style={{ marginBottom: '20px' }}
      />

      {/* Previsualización de la credencial */}
      <div
        style={{
          width: '400px',
          height: '250px',
          margin: '20px auto',
          border: '1px solid #ccc',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#f9f9f9'
        }}
      >
        {preview
          ? (
            <img src={preview} alt='Preview' style={{ width: '100px', height: '100px', marginBottom: '10px' }} />
            )
          : (
            <p>Previsualización</p>
            )}
        <p style={{ fontSize: '14px' }}>Nombre: John Doe</p>
        <p style={{ fontSize: '14px' }}>ID: 123456</p>
      </div>

      {/* Botón para descargar la credencial */}
      <button
        onClick={handleDownload}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Descargar Credencial
      </button>
    </div>
  )
}
