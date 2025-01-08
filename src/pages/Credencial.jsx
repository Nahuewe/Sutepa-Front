import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { FileInput } from 'flowbite-react'
import ReCAPTCHA from 'react-google-recaptcha'
import sutepaApi from '../api/sutepaApi'

export const Credencial = () => {
  const [, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [identifier, setIdentifier] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPersonFound, setIsPersonFound] = useState(false)
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false)
  const [showDownloadButton, setShowDownloadButton] = useState(false)
  const [credencial, setCredencial] = useState([])
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [personData, setPersonData] = useState({
    nombre: 'Nombre y Apellido',
    legajo: '000000',
    dni: '00.000.000'
  })

  const canvasRef = useRef(null)

  async function handleCredencial () {
    try {
      const response = await sutepaApi.get('credencial')
      const { data } = response
      setCredencial(data)
    } catch (error) {
      console.error('Error al obtener credenciales:', error)
      toast.error('Hubo un problema al cargar los datos. Intenta nuevamente más tarde.')
    }
  }

  const handleCaptchaChange = (value) => {
    if (value) {
      setTimeout(() => {
        setCaptchaVerified(true)
      }, 0)
    } else {
      setCaptchaVerified(false)
      toast.error('Por favor, completa el CAPTCHA.')
    }
  }

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

    if (credencial.length === 0) {
      toast.error('No se han cargado los datos de afiliados. Intenta de nuevo.')
      return
    }

    setIsLoading(true)
    try {
      const isDni = identifier.length === 10
      const cleanedIdentifier = identifier.replace(/\./g, '')

      const person = credencial.find((p) => {
        const cleanedDni = p.dni.replace(/\./g, '')
        const cleanedLegajo = p.legajo
        return (isDni && cleanedDni === cleanedIdentifier) || (!isDni && cleanedLegajo === identifier)
      })

      if (person) {
        if (person.estado.toUpperCase() === 'INACTIVO') {
          setIsPersonFound(false)
          toast.error('El afiliado está inactivo y no se puede generar la credencial.')
          return
        }

        setPersonData({
          nombre: `${person.apellido} ${person.nombre}`.toUpperCase(),
          legajo: person.legajo,
          dni: person.dni,
          estado: person.estado
        })
        setIsPersonFound(true)
        toast.success(`Afiliado encontrado: ${person.nombre.toUpperCase()} ${person.apellido.toUpperCase()}`)
      } else {
        setIsPersonFound(false)
        toast.error('Afiliado no encontrado, intentalo de nuevo.')
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
      setIsPhotoUploaded(true)
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result)
      reader.readAsDataURL(file)
      setTimeout(() => setShowDownloadButton(true), 300)
    } else {
      setIsPhotoUploaded(false)
      setShowDownloadButton(false)
    }
  }

  const handleDownload = async () => {
    const canvas = document.createElement('canvas')
    await drawCanvas(canvas)

    const link = document.createElement('a')
    link.download = 'credencial-SUTEPA.png'
    link.href = canvas.toDataURL('image/png', 1.0)
    link.click()
  }

  const drawCanvas = (canvas) => {
    return new Promise((resolve) => {
      const scaleFactor = 4
      const ctx = canvas.getContext('2d')

      canvas.width = 500 * scaleFactor
      canvas.height = 300 * scaleFactor
      ctx.scale(scaleFactor, scaleFactor)

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      const background = new Image()
      background.src = '/carnet-sutepa.jpg'
      background.onload = () => {
        ctx.drawImage(
          background,
          0,
          0,
          canvas.width / scaleFactor,
          canvas.height / scaleFactor
        )

        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 12px Arial'

        const textX = 285
        let currentY = 127

        ctx.fillText(personData.nombre.toUpperCase(), textX, currentY)
        currentY += 27.2
        ctx.fillText(personData.legajo, textX, currentY)
        currentY += 27.2
        ctx.fillText(personData.dni, textX, currentY)
        currentY += 27.2
        ctx.fillText(personData.estado, textX, currentY)
        currentY += 27.2

        const currentDate = new Date()
        const validUntil = new Date(currentDate)
        validUntil.setFullYear(currentDate.getFullYear() + 1)

        const day = String(validUntil.getDate()).padStart(2, '0')
        const month = String(validUntil.getMonth() + 1).padStart(2, '0')
        const year = validUntil.getFullYear()
        const validUntilDate = `${day}/${month}/${year}`

        ctx.fillText(validUntilDate, textX, currentY)

        if (preview) {
          const img = new Image()
          img.src = preview
          img.onload = () => {
            const imgWidth = img.width
            const imgHeight = img.height

            // Determinar la región central de la imagen
            const cropSize = Math.min(imgWidth, imgHeight) // Escoger un cuadrado basado en el lado más pequeño
            const cropX = (imgWidth - cropSize) / 2 // Calcular el inicio del recorte en el eje X
            const cropY = (imgHeight - cropSize) / 2 // Calcular el inicio del recorte en el eje Y

            // Ajustar las dimensiones donde la imagen será renderizada en el canvas
            const imageWidth = 120 // Ancho deseado en el canvas
            const imageHeight = 120 // Alto deseado en el canvas
            const imageX = 25 // Coordenada X en el canvas
            const imageY = 115 // Coordenada Y en el canvas

            // Dibujar la imagen recortada en el canvas
            ctx.drawImage(
              img, // Imagen original
              cropX, cropY, // Coordenadas de inicio del recorte
              cropSize, cropSize, // Dimensiones del recorte
              imageX, imageY, // Posición en el canvas
              imageWidth, imageHeight // Dimensiones en el canvas
            )
            resolve()
          }
        } else {
          resolve()
        }
      }
    })
  }

  useEffect(() => {
    if (canvasRef.current) {
      drawCanvas(canvasRef.current)
    }
  }, [personData, preview])

  useEffect(() => {
    handleCredencial()
  }, [])

  return (
    <div className='md:min-h-screen md:flex md:items-center md:justify-center bg-gray-200'>
      <div className='max-w-4xl w-full p-8 bg-white shadow-lg rounded-lg'>
        <h1 className='text-3xl font-semibold text-gray-800 mb-6 text-center dark:text-gray-800'>Generar Credencial</h1>

        {!captchaVerified && (
          <div className='flex justify-center mb-6'>
            <ReCAPTCHA
              // Produccion
              sitekey='6LdlEZ8qAAAAAP4O152j9LdigI0b04S4nWlwpUEF'
              // LocalHost
              // sitekey='6LeAwp8qAAAAABhAYn5FDw_uIzk8bskuHIP_sBIw'
              onChange={handleCaptchaChange}
            />
          </div>
        )}

        {captchaVerified && (
          <>
            <span className='text-sm text-gray-500 dark:text-gray-500'>Escribe tu legajo o DNI y luego haz clic en "Buscar".</span>
            <div className='flex flex-col sm:flex-row gap-4 mb-6 mt-2'>
              <input
                type='text'
                placeholder='Ingresá tu DNI o Legajo y luego buscá'
                value={identifier}
                onChange={handleIdentifierChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch()
                  }
                }}
                className='p-3 w-full sm:w-2/3 border border-gray-300 dark:text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <button
                onClick={handleSearch}
                className={`w-full md:w-96 px-6 py-3 rounded-md text-white font-semibold transition ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                disabled={isLoading}
              >
                {isLoading
                  ? (
                    <span className='flex items-center gap-2'>
                      <svg
                        className='w-4 h-4 animate-spin' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'
                        />
                        <path
                          className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                        />
                      </svg>
                      {isLoading ? 'Cargando...' : 'Buscando...'}
                    </span>
                    )
                  : (
                      'Buscar'
                    )}
              </button>

            </div>
          </>
        )}

        {isPersonFound && personData.estado.toUpperCase() !== 'INACTIVO' && (
          <div>
            <span className='text-sm text-gray-500'>Sube tu foto para la credencial.</span>
            <FileInput
              type='file'
              accept='image/*'
              capture='user'
              onChange={handleImageUpload}
              className='w-full sm:w-auto mb-6 mt-2 rounded-md'
            />
          </div>
        )}

        {isPersonFound && personData.estado.toUpperCase() !== 'INACTIVO' && captchaVerified && (
          <div>
            <span className='text-sm text-gray-500 flex justify-center mb-2'>Vista previa.</span>
            <div className='w-full sm:w-96 mx-auto bg-gray-50 border border-gray-300 rounded-lg p-4 flex flex-col items-center'>
              <canvas ref={canvasRef} className='w-full h-auto rounded-md' />
            </div>
          </div>
        )}

        {isPersonFound && personData.estado.toUpperCase() !== 'INACTIVO' && isPhotoUploaded && captchaVerified && (
          <button
            onClick={() => {
              if (personData.estado === 'INACTIVO') {
                toast.error('No se puede descargar la credencial para un afiliado INACTIVO.')
                return
              }
              handleDownload()
            }}
            className={`mt-6 px-6 py-3 w-full text-white rounded-md transition transform ${showDownloadButton ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} bg-blue-600 hover:bg-blue-700`}
          >
            Descargar Credencial
          </button>
        )}
      </div>
    </div>
  )
}
