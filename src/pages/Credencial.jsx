import React, { useState, useEffect, useRef } from 'react'
import { sutepaApi } from '@/api'
import { toast } from 'react-toastify'
import { FileInput } from 'flowbite-react'
import Logo from '@/assets/images/logo/logo-sutepa.png'

export const Credencial = () => {
  const [, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [identifier, setIdentifier] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPersonFound, setIsPersonFound] = useState(false)
  const [personData, setPersonData] = useState({
    nombre: 'Nombre y Apellido',
    legajo: '000000',
    dni: '00.000.000'
  })

  const canvasRef = useRef(null)

  const handleIdentifierChange = (e) => {
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

    setIdentifier(formattedDni)
  }

  const handleSearch = async () => {
    if (!identifier) {
      toast.error('Por favor, ingresa un DNI o número de legajo.')
      return
    }

    setIsLoading(true)
    try {
      const response = await sutepaApi.get('/personaAll')
      const personas = response.data.data
      if (!Array.isArray(personas)) {
        throw new Error('La respuesta no contiene una lista válida de personas.')
      }

      // Determinar si el valor ingresado es un DNI o un Legajo
      const isDni = identifier.length === 10
      const person = personas.find((p) => {
        const cleanedIdentifier = identifier.replace(/\./g, '')
        const cleanedDni = p.dni.replace(/\./g, '')
        return (isDni && cleanedDni === cleanedIdentifier) || (!isDni && p.legajo === identifier)
      })

      if (person) {
        if (person.estado.toUpperCase() === 'INACTIVO') {
          setIsPersonFound(false)
          toast.error('El afiliado está inactivo y no se puede generar la credencial.')
          return
        }

        setPersonData({
          nombre: `${person.apellido} ${person.nombre} `.toUpperCase(),
          legajo: person.legajo,
          dni: person.dni,
          estado: person.estado
        })
        setIsPersonFound(true)
        toast.success(`Afiliado encontrado: ${person.nombre} ${person.apellido}`)
      } else {
        setIsPersonFound(false)
        toast.error('Afiliado no encontrado.')
      }
    } catch (error) {
      console.error('Error al buscar al afiliado:', error)
      setIsPersonFound(false)
      toast.error('Hubo un problema al buscar al afiliado.')
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

      // Fondo gris claro sin bordes redondeados
      const width = canvas.width / scaleFactor // Ancho ajustado al factor de escala
      const height = canvas.height / scaleFactor // Altura ajustada al factor de escala

      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(0, 0, width, height)

      // El resto del código sigue igual
      const dividerGradient = ctx.createLinearGradient(0, 0, width, 0)
      dividerGradient.addColorStop(0, '#e02424')
      dividerGradient.addColorStop(1, '#004d73')
      ctx.fillStyle = dividerGradient
      ctx.fillRect(0, 0, width, 20)

      const headerGradient = ctx.createLinearGradient(0, 20, width, 20)
      headerGradient.addColorStop(0, '#fff')
      headerGradient.addColorStop(1, '#fff')
      ctx.fillStyle = headerGradient
      ctx.fillRect(0, 20, width, 80)

      const logo = new Image()
      logo.src = Logo
      logo.onload = () => {
        const logoWidth = 150
        const logoHeight = 50
        const logoX = 20
        const logoY = 35
        ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight)

        // Leyenda al lado del logo
        ctx.fillStyle = '#000'
        ctx.font = 'bold 16px Arial'

        const textoParte1 = 'Sindicato Unido de Trabajadores'
        const textoParte2 = 'y Empleados de PAMI'

        ctx.fillText(textoParte1, logoX + logoWidth + 40, logoY + 20)
        ctx.fillText(textoParte2, logoX + logoWidth + 40, logoY + 40)

        const lineY = logoY + logoHeight + 15
        ctx.fillStyle = dividerGradient
        ctx.fillRect(0, lineY, width, 2)

        ctx.fillStyle = '#000'
        ctx.font = 'bold 18px Arial'
        ctx.fillText(personData.nombre.toUpperCase(), 20, 140)
        ctx.font = '16px Arial'
        ctx.fillText(`Legajo: ${personData.legajo}`, 20, 170)
        ctx.fillText(`Documento Nº: ${personData.dni}`, 20, 200)
        ctx.fillText(`Estado: ${personData.estado}`, 20, 230)

        const currentDate = new Date()
        const validUntil = new Date(currentDate)
        validUntil.setMonth(currentDate.getMonth() + 1)

        const day = validUntil.getDate()
        const monthYear = validUntil
          .toLocaleString('es-ES', { month: 'long', year: 'numeric' })
          .toUpperCase()
        const validUntilDate = `${day} de ${monthYear}`
        ctx.fillText(`Válido hasta: ${validUntilDate}`, 20, 260)

        if (preview) {
          const img = new Image()
          img.src = preview
          img.onload = () => {
            const imageWidth = 130
            const imageHeight = 130
            const imageX = width - imageWidth - 30
            const imageY = 130
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
    <div className='md:min-h-screen md:flex md:items-center md:justify-center bg-gray-100'>
      <div className='max-w-4xl w-full p-8 bg-white shadow-lg rounded-lg'>
        <h1 className='text-3xl font-semibold text-gray-800 mb-6 text-center'>Generar Credencial</h1>

        <span className='text-sm text-gray-500'>Escribe tu legajo o DNI y luego haz clic en "Buscar".</span>
        <div className='flex flex-col sm:flex-row gap-4 mb-6 mt-2'>
          <input
            type='text'
            placeholder='Ingresá tu DNI o Legajo y luego buscá'
            value={identifier}
            onChange={handleIdentifierChange}
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

        {isPersonFound && personData.estado.toUpperCase() !== 'INACTIVO' && (
          <div>
            <span className='text-sm text-gray-500'>Sube tu foto para la credencial.</span>
            <FileInput
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              className='w-full sm:w-auto mb-6 mt-2 rounded-md'
            />
          </div>
        )}

        {isPersonFound && personData.estado.toUpperCase() !== 'INACTIVO' && (
          <div>
            <span className='text-sm text-gray-500 flex justify-center mb-2'>Vista previa.</span>
            <div className='w-full sm:w-96 mx-auto bg-gray-50 border border-gray-300 rounded-lg p-4 flex flex-col items-center'>
              <canvas ref={canvasRef} className='w-full h-auto rounded-md' />
            </div>
          </div>
        )}

        {isPersonFound && personData.estado.toUpperCase() !== 'INACTIVO' && (
          <button
            onClick={() => {
              if (personData.estado === 'INACTIVO') {
                toast.error('No se puede descargar la credencial para un afiliado INACTIVO.')
                return
              }
              handleDownload()
            }}
            className={`mt-6 px-6 py-3 w-full text-white rounded-md transition ${!isPersonFound || personData.estado === 'INACTIVO'
              ? 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={!isPersonFound || personData.estado === 'INACTIVO'}
          >
            Descargar Credencial
          </button>
        )}
      </div>
    </div>
  )
}
