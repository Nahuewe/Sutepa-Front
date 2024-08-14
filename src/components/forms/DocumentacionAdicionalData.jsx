import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sutepaApi } from '@/api'
import { toast } from 'react-toastify'
import { FileInput } from 'flowbite-react'
import { SelectForm } from '@/components/sutepa/forms'
import { Icon } from '@iconify/react/dist/iconify.js'
import { onAddDocumento, onDeleteDocumento } from '@/store/afiliado'
import { formatDate } from '@/constant/datos-id'
import Card from '@/components/ui/Card'
import Tooltip from '@/components/ui/Tooltip'
import Loading from '@/components/Loading'

const initialForm = {
  tipo_documento_id: '',
  archivo: '',
  users_id: null
}

function DocumentacionAdicionalData ({ register }) {
  const dispatch = useDispatch()
  const [documentos, setDocumentos] = useState([])
  const { user } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState(initialForm)
  const formRef = useRef()
  const [archivoOptions, setArchivoOptions] = useState([])
  const { activeAfiliado } = useSelector((state) => state.afiliado)
  const [isLoading, setIsLoading] = useState(true)
  const [idCounter, setIdCounter] = useState(0)
  const [loadingDocumentos, setLoadingDocumentos] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false) // Nuevo estado para el loading

  const handleArchivo = async () => {
    const response = await sutepaApi.get('documentacion')
    const { data } = response.data
    setArchivoOptions(data)
  }

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        archivo: file
      })
    } else {
      setFormData({
        ...formData,
        archivo: ''
      })
    }
  }

  const onReset = () => {
    formRef.current.reset()
    setFormData(initialForm)
  }

  const getDocumentoByName = (id) => {
    const documentoObj = archivoOptions.find((item) => item.id === id)
    return documentoObj ? documentoObj.nombre : ''
  }

  const enviarArchivo = async (documento) => {
    const formDataToSend = new FormData()

    if (documento.archivo instanceof File) {
      formDataToSend.append('documentacion[0][archivo]', documento.archivo)
    } else {
      formDataToSend.append('documentacion[0][archivo]', documento.archivo)
    }

    formDataToSend.append('documentacion[0][tipo_documento_id]', documento.tipo_documento_id)
    formDataToSend.append('documentacion[0][users_id]', documento.users_id)

    try {
      const response = await sutepaApi.post('file', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success('Documento agregado correctamente')
      return response.data
    } catch (error) {
      toast.error('Error al enviar el documento')
      throw error
    }
  }

  const cambiarEstadoAfiliado = async (estado) => {
    try {
      await sutepaApi.delete(`/personas/${activeAfiliado.persona.id}`, { estado })
      toast.success(`Afiliado cambiado a ${estado} correctamente`)
    } catch (error) {
      toast.error('No se pudo cambiar el estado del afiliado')
    }
  }

  const agregarDocumento = async () => {
    const tipoArchivoOption = archivoOptions.find(
      (option) => option.id === parseInt(formData.tipo_documento_id)
    )

    if (tipoArchivoOption && formData.archivo) {
      setIsSubmitting(true)

      const nuevoDocumento = {
        ...formData,
        id: idCounter,
        tipo_documento_id: tipoArchivoOption.id,
        archivo: formData.archivo,
        fecha_carga: new Date(),
        users_id: user.id,
        users_nombre: user.username,
        blobURL: URL.createObjectURL(formData.archivo)
      }

      if (!documentos.some((doc) => doc.archivo === nuevoDocumento.archivo)) {
        try {
          // Subir el archivo al servidor, enviando el temp_id
          const response = await enviarArchivo(nuevoDocumento)
          const documentoId = response.ids[0]

          nuevoDocumento.id = documentoId
          dispatch(onAddDocumento(nuevoDocumento))
          setDocumentos([...documentos, nuevoDocumento])
          setIdCounter(idCounter + 1)

          // Si el tipo de archivo es "TELEGRAMA DE BAJA", cambiar el estado del afiliado a "INACTIVO"
          if (nuevoDocumento.tipo_documento_id === 7) {
            await cambiarEstadoAfiliado('INACTIVO')
          }
        } catch (error) {
          console.error('Error al agregar documento:', error)
        } finally {
          setIsSubmitting(false)
        }
      } else {
        toast.error('El documento ya está en la lista.')
        setIsSubmitting(false)
      }

      onReset()
    } else {
      toast.error('Selecciona un tipo de archivo y subí un documento')
    }
  }

  const onDelete = async (index) => {
    const documentoAEliminar = documentos[index]

    try {
      // Hacer la solicitud DELETE al backend
      await sutepaApi.delete(`file/${documentoAEliminar.id}`)

      // Si la eliminación es exitosa, eliminar el documento del estado
      const newDocumentos = documentos.filter((_, i) => i !== index)
      setDocumentos(newDocumentos)

      dispatch(onDeleteDocumento(documentoAEliminar.id))
      toast.success('Documento eliminado correctamente')
    } catch (error) {
      toast.error('Error al eliminar el documento')
    }
  }

  useEffect(() => {
    if (activeAfiliado?.documentaciones) {
      setDocumentos(activeAfiliado.documentaciones)
    }
  }, [activeAfiliado])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (activeAfiliado?.documentaciones) {
        if (documentos.length === 0) {
          setDocumentos(activeAfiliado.documentaciones)
        } else {
          const documentosExistentesIds = documentos.map((doc) => doc.id)
          const nuevosDocumentos = activeAfiliado.documentaciones.filter(
            (doc) => !documentosExistentesIds.includes(doc.id)
          )
          setDocumentos((prevDocumentos) => [...prevDocumentos, ...nuevosDocumentos])
        }
      }
      setLoadingDocumentos(false)
    }, 1)

    return () => clearTimeout(timer)
  }, [activeAfiliado])

  async function loadingAfiliado () {
    !isLoading && setIsLoading(true)

    await handleArchivo()
    setIsLoading(false)
  }

  useEffect(() => {
    loadingAfiliado()
  }, [])

  useEffect(() => {
    if (!loadingDocumentos) {
      documentos.forEach((documento) => {
        dispatch(onAddDocumento(documento))
      })
    }
  }, [documentos, loadingDocumentos, dispatch])

  return (
    <>
      {isLoading
        ? (
          <Loading className='mt-28 md:mt-64' />
          )
        : (
          <div>
            <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
              Documentación Adicional
            </h4>

            <Card>
              <form ref={formRef}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <SelectForm
                    register={register('tipo_documento_id')}
                    title='Tipo de Archivo'
                    options={archivoOptions}
                    onChange={handleInputChange}
                  />
                  <div>
                    <label htmlFor='archivo' className='form-label'>
                      Archivo
                    </label>
                    <FileInput
                      type='file'
                      id='archivo'
                      name='archivo'
                      onChange={handleFileChange}
                      accept='.docx,.doc,.xlsx,.ppt,.pdf,.jpeg,.jpg,.png'
                    />
                  </div>
                </div>
                <div className='flex justify-end mt-4 gap-4'>
                  <button
                    type='button'
                    className={`btn btn-primary ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-600'} btn btn-primary rounded-lg`}
                    onClick={agregarDocumento}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Subiendo...' : 'Agregar Documento'}
                  </button>
                </div>
              </form>
            </Card>

            {documentos.length > 0 && (
              <div className='overflow-x-auto mt-4 mb-4'>
                <table className='table-auto w-full'>
                  <thead className='bg-gray-300 dark:bg-gray-700'>
                    <tr>
                      <th className='px-4 py-2 text-center dark:text-white'>
                        Fecha de Carga
                      </th>
                      <th className='px-4 py-2 text-center dark:text-white'>
                        Tipo de Archivo
                      </th>
                      <th className='px-4 py-2 text-center dark:text-white'>
                        Vista Previa
                      </th>
                      <th className='px-4 py-2 text-center dark:text-white'>
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y dark:divide-gray-700'>
                    {documentos.map((documento, index) => (
                      <tr
                        key={index}
                        className='bg-white dark:bg-gray-800 dark:border-gray-700'
                      >
                        {activeAfiliado && (
                          <td className='px-4 py-2 text-center dark:text-white'>
                            {formatDate(documento.created_at || documento.fecha_carga)}
                          </td>
                        )}
                        {!activeAfiliado && (
                          <td className='px-4 py-2 text-center dark:text-white'>
                            {formatDate(documento.fecha_carga)}
                          </td>
                        )}
                        <td className='px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-center'>
                          {documento.tipo_documento ||
                          getDocumentoByName(documento.tipo_documento_id)}
                        </td>
                        <td className='px-4 py-2 text-center'>
                          <a
                            href={documento.blobURL || documento.archivo_url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:underline dark:text-blue-400'
                          >
                            Ver Documento
                          </a>
                        </td>
                        <td className='text-center py-2'>
                          <Tooltip content='Eliminar'>
                            <button
                              type='button'
                              onClick={() => onDelete(index)}
                              className=' text-red-600 hover:text-red-900'
                            >
                              <Icon
                                icon='heroicons:trash'
                                width='24'
                                height='24'
                              />
                            </button>
                          </Tooltip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          )}
    </>
  )
}

export default DocumentacionAdicionalData
