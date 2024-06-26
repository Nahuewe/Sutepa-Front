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
  archivo: null,
  users_id: null
}

function DocumentacionAdicionalData ({ register }) {
  const dispatch = useDispatch()
  const [documentos, setDocumentos] = useState([])
  const { user } = useSelector(state => state.auth)
  const [formData, setFormData] = useState(initialForm)
  const formRef = useRef()
  const [archivoOptions, setArchivoOptions] = useState([])
  const { activeAfiliado } = useSelector(state => state.afiliado)
  const [isLoading, setIsLoading] = useState(true)
  const idCounter = useRef(1)

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

  const onReset = () => {
    formRef.current.reset()
    setFormData(initialForm)
  }

  const getDocumentoByName = id => {
    const documentoObj = archivoOptions.find(item => item.id === id)
    return documentoObj ? documentoObj.nombre : ''
  }

  const agregarDocumento = () => {
    const tipoArchivoOption = archivoOptions.find(option => option.id === parseInt(formData.tipo_documento_id))
    if (tipoArchivoOption && formData.archivo) {
      const nuevoDocumento = {
        id: idCounter.current,
        ...formData,
        tipo_documento_id: tipoArchivoOption.id,
        archivo: formData.archivo,
        fecha_carga: new Date(),
        users_id: user.id,
        users_nombre: user.username
      }

      // Verificar el contenido del nuevo documento
      console.log('Nuevo documento:', nuevoDocumento)

      idCounter.current += 1

      // Verificar si el documento ya existe en el estado local
      if (!documentos.some(doc => doc.archivo.name === nuevoDocumento.archivo.name)) {
        dispatch(onAddDocumento(nuevoDocumento))
        setDocumentos([...documentos, nuevoDocumento])
      } else {
        toast.error('El documento ya está en la lista.')
      }

      onReset()
    } else {
      toast.error('Selecciona un tipo de archivo y subí un documento')
    }
  }

  const onDelete = (index) => {
    const documentoAEliminar = documentos[index]
    const newDocumentos = documentos.filter((_, i) => i !== index)
    setDocumentos(newDocumentos)
    dispatch(onDeleteDocumento(documentoAEliminar.id))
  }

  useEffect(() => {
    if (activeAfiliado?.documentaciones) {
      setDocumentos(activeAfiliado.documentaciones)
    }
  }, [activeAfiliado])

  async function loadingAfiliado () {
    !isLoading && setIsLoading(true)

    await handleArchivo()
    setIsLoading(false)
  }

  useEffect(() => {
    loadingAfiliado()
  }, [])

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
                    <label htmlFor='archivo' className='form-label'>Archivo</label>
                    <FileInput
                      type='file'
                      id='archivo'
                      name='archivo'
                      onChange={handleInputChange}
                      accept='.docx,.doc,.xlsx,.ppt,.pdf,.jpeg,.jpg,.png'
                    />
                  </div>
                </div>
                <div className='flex justify-end mt-4 gap-4'>
                  <button
                    type='button'
                    className='btn btn-primary rounded-lg'
                    onClick={agregarDocumento}
                  >
                    Agregar Documento
                  </button>
                </div>
              </form>
            </Card>

            {documentos.length > 0 && (
              <div className='overflow-x-auto mt-4'>
                <table className='table-auto w-full'>
                  <thead className='bg-gray-300 dark:bg-gray-700'>
                    <tr>
                      <th className='px-4 py-2 text-center dark:text-white'>Fecha de Carga</th>
                      <th className='px-4 py-2 text-center dark:text-white'>Tipo de Archivo</th>
                      <th className='px-4 py-2 text-center dark:text-white'>Enlace del Archivo</th>
                      <th className='px-4 py-2 text-center dark:text-white'>Usuario de Carga</th>
                      <th className='px-4 py-2 text-center dark:text-white'>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y dark:divide-gray-700'>
                    {documentos.map((documento, index) => (
                      <tr key={index} className='bg-white dark:bg-gray-800 dark:border-gray-700'>
                        {activeAfiliado && (
                          <td className='px-4 py-2 text-center dark:text-white'>{formatDate(documento.created_at || documento.fecha_carga)}</td>
                        )}
                        {!activeAfiliado && (
                          <td className='px-4 py-2 text-center dark:text-white'>{formatDate(documento.fecha_carga)}</td>
                        )}
                        <td className='px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-center'>
                          {getDocumentoByName(documento.tipo_documento_id)}
                        </td>
                        <td className='px-4 py-2 text-center dark:text-white'>
                          <a href={URL.createObjectURL(documento.archivo)} target='_blank' rel='noopener noreferrer' className='text-blue-500 underline'>
                            {documento.archivo.name}
                          </a>
                        </td>
                        {activeAfiliado
                          ? (
                            <td className='px-4 py-2 text-center dark:text-white'>{documento.users_nombre}</td>
                            )
                          : (
                            <td className='px-4 py-2 text-center dark:text-white'>{user.username}</td>
                            )}
                        <td className='text-center py-2'>
                          <Tooltip content='Eliminar'>
                            <button
                              type='button'
                              onClick={() => onDelete(index)}
                              className='text-red-600 hover:text-red-900'
                            >
                              <Icon icon='heroicons:trash' width='24' height='24' />
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
