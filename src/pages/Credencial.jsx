import React, { useState, useEffect, useRef } from 'react'
import { sutepaApi } from '@/api'
import { toast } from 'react-toastify'
import { FileInput } from 'flowbite-react'
import Logo from '@/assets/images/logo/logo-sutepa.png'

export const Credencial = () => {
  const [, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [dni, setDni] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPersonFound, setIsPersonFound] = useState(false)
  const [personData, setPersonData] = useState({
    nombre: 'Nombre y Apellido',
    legajo: '000000',
    dni: '00.000.000'
  })

  const canvasRef = useRef(null)

  const handleDniChange = (e) => {
    const value = e.target.value
    const cleanedValue = value.replace(/[^\d]/g, '')
    const dniFormat = /^(\d{1,2})(\d{3})(\d{3})$/
    let formattedDni = ''
    const maxLength = 8

    if (cleanedValue.length > maxLength) {
      return
    }

    if (cleanedValue.length > 1 && cleanedValue.length <= 9) {
      formattedDni = cleanedValue.replace(dniFormat, '$1.$2.$3')
    } else {
      formattedDni = cleanedValue
    }

    setDni(formattedDni)
  }

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      const response = await sutepaApi.get('/personaAll')
      const personas = response.data.data
      if (!Array.isArray(personas)) {
        throw new Error('La respuesta no contiene una lista válida de personas.')
      }

      const person = personas.find((p) => p.dni === dni)
      if (person) {
        setPersonData({
          nombre: `${person.nombre} ${person.apellido}`,
          legajo: person.legajo,
          dni: person.dni
        })
        setIsPersonFound(true)
        toast.success(`Afiliado encontrado: ${person.nombre} ${person.apellido}`)
      } else {
        setIsPersonFound(false)
        toast.error('Afiliado no encontrado.')
      }
    } catch (error) {
      console.error('Error al buscar la Afiliado:', error)
      setIsPersonFound(false)
      toast.error('Hubo un problema al buscar la Afiliado.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const drawCanvas = (canvas) => {
    return new Promise((resolve) => {
      const scaleFactor = 2
      const ctx = canvas.getContext('2d')

      // Configurar tamaño y resolución
      canvas.width = 500 * scaleFactor
      canvas.height = 300 * scaleFactor
      ctx.scale(scaleFactor, scaleFactor)

      // Fondo gris claro con bordes redondeados
      const cornerRadius = 15 // Ajusta el radio de las esquinas
      ctx.fillStyle = '#f3f4f6' // Gris claro
      ctx.beginPath()
      ctx.moveTo(cornerRadius, 0)
      ctx.lineTo(canvas.width / scaleFactor - cornerRadius, 0)
      ctx.arcTo(canvas.width / scaleFactor, 0, canvas.width / scaleFactor, canvas.height / scaleFactor, cornerRadius)
      ctx.lineTo(canvas.width / scaleFactor, canvas.height / scaleFactor - cornerRadius)
      ctx.arcTo(canvas.width / scaleFactor, canvas.height / scaleFactor, 0, canvas.height / scaleFactor, cornerRadius)
      ctx.lineTo(0, canvas.height / scaleFactor)
      ctx.arcTo(0, canvas.height / scaleFactor, 0, 0, cornerRadius)
      ctx.lineTo(0, cornerRadius)
      ctx.closePath()
      ctx.fill()

      // Franja adicional superior
      const dividerGradient = ctx.createLinearGradient(0, 0, canvas.width / scaleFactor, 0)
      dividerGradient.addColorStop(0, '#e02424')
      dividerGradient.addColorStop(1, '#004d73')
      ctx.fillStyle = dividerGradient
      ctx.fillRect(0, 0, canvas.width / scaleFactor, 20)

      // Header con gradiente (debajo de la franja adicional)
      const headerGradient = ctx.createLinearGradient(0, 20, canvas.width / scaleFactor, 20)
      headerGradient.addColorStop(0, '#fff')
      headerGradient.addColorStop(1, '#fff')
      ctx.fillStyle = headerGradient
      ctx.fillRect(0, 20, canvas.width / scaleFactor, 80)

      const logo = new Image()
      logo.src = Logo
      logo.onload = () => {
        const logoWidth = 150
        const logoHeight = 50
        const logoX = 20
        const logoY = 35
        ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight)

        // Gradiente en la barra divisoria
        const dividerGradient = ctx.createLinearGradient(0, 0, canvas.width / scaleFactor, 0)
        dividerGradient.addColorStop(0, '#e02424')
        dividerGradient.addColorStop(1, '#004d73')
        ctx.fillStyle = dividerGradient
        ctx.fillRect(0, 100, canvas.width / scaleFactor, 5)

        // Sección inferior con fondo gris
        ctx.fillStyle = '#e5e7eb' // Gris claro
        ctx.fillRect(0, 105, canvas.width / scaleFactor, canvas.height / scaleFactor - 105)

        // Información del afiliado
        ctx.fillStyle = '#000'
        ctx.font = 'bold 18px Arial'
        ctx.fillText(personData.nombre, 20, 140)
        ctx.font = '16px Arial'
        ctx.fillText(`Afiliado: ${personData.legajo}`, 20, 170)
        ctx.fillText(`Documento Nº: ${personData.dni}`, 20, 200)

        // Logo o imagen del usuario alineada a la derecha
        if (preview) {
          const img = new Image()
          img.src = preview
          img.onload = () => {
            const imageWidth = 100
            const imageHeight = 100
            // Cambia la posición X para mover la imagen hacia la derecha
            const imageX = canvas.width / scaleFactor - imageWidth - 20 // Ajusta el -20 para dar un margen
            const imageY = 120
            ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight)
            resolve()
          }
        } else {
          resolve()
        }
      }
    })
  }

  const handleDownload = async () => {
    const canvas = document.createElement('canvas')
    await drawCanvas(canvas)
    const link = document.createElement('a')
    link.download = 'credencial-SUTEPA.png'
    link.href = canvas.toDataURL('image/png', 1.0)
    link.click()
  }

  useEffect(() => {
    if (canvasRef.current) {
      drawCanvas(canvasRef.current)
    }
  }, [personData, preview])

  return (
    <div className='max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg'>
      <h1 className='text-3xl font-semibold text-gray-800 mb-6 text-center'>Generar Credencial</h1>

      <span className='text-sm text-gray-500'>Escribe tu DNI y luego haz clic en "Buscar".</span>
      <div className='flex flex-col sm:flex-row gap-4 mb-6 mt-2'>
        <input
          type='text'
          placeholder='Ingresá tu DNI y luego buscá'
          value={dni}
          onChange={handleDniChange}
          className='p-3 w-full sm:w-2/3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button
          onClick={handleSearch}
          className={`w-full md:w-96 px-6 py-3 rounded-md text-white font-semibold transition ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          disabled={isLoading}
        >
          {isLoading
            ? (
              <span className='flex items-center gap-2'>
                <svg
                  className='w-4 h-4 animate-spin'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                  />
                </svg>
                Buscando...
              </span>
              )
            : (
                'Buscar'
              )}
        </button>
      </div>

      <span className='text-sm text-gray-500'>Sube tu foto para la credencial.</span>
      <FileInput
        type='file'
        accept='image/*'
        onChange={handleImageUpload}
        className='w-full sm:w-auto mb-6 mt-2 rounded-md'
      />

      <span className='text-sm text-gray-500 flex justify-center mb-2'>Vista previa.</span>
      <div className='w-full sm:w-96 mx-auto bg-gray-50 border border-gray-300 rounded-lg p-4 flex flex-col items-center'>
        <canvas ref={canvasRef} className='w-full h-auto rounded-md' />
      </div>

      <button
        onClick={handleDownload}
        className={`mt-6 px-6 py-3 w-full bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ${!isPersonFound ? 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed' : ''
          }`}
        disabled={!isPersonFound}
      >
        Descargar Credencial
      </button>

    </div>
  )
}
