import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sutepaApi } from '../../api'
import { toast } from 'react-toastify'
import { FileInput } from 'flowbite-react'
import Card from '@/components/ui/Card'
import { SelectForm } from '@/components/sutepa/forms'
import Tooltip from '@/components/ui/Tooltip'
import { Icon } from '@iconify/react/dist/iconify.js'
import { onAddDocumento, onDeleteDocumento } from '../../store/ingreso'

const initialForm = {
  tipo_documento_id: '',
  archivo: '',
  url: null
}

function DocumentacionAdicionalData ({ register, disabled }) {
  const dispatch = useDispatch()
  const [documentos, setDocumentos] = useState([])
  const { user } = useSelector(state => state.auth)
  const [formData, setFormData] = useState(initialForm)
  const formRef = useRef()
  const [archivoOptions, setArchivoOptions] = useState([])

  const handleArchivo = async () => {
    try {
      const response = await sutepaApi.get('documentacion')
      const { data } = response.data
      setArchivoOptions(data)
    } catch (error) {
      console.error('Error fetching archivo options:', error)
    }
  }

  useEffect(() => {
    handleArchivo()
  }, [])

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

  const agregarDocumento = () => {
    const tipoArchivoOption = archivoOptions.find(option => option.id === parseInt(formData.tipo_documento_id))
    if (tipoArchivoOption && formData.archivo) {
      const nuevoDocumento = {
        ...formData,
        tipo_documento_id: tipoArchivoOption.id,
        id: Date.now(),
        archivo: formData.archivo.name,
        fecha_carga: new Date().toLocaleDateString('es-ES'),
        url: URL.createObjectURL(formData.archivo)
      }
      dispatch(onAddDocumento(nuevoDocumento))
      setDocumentos([...documentos, nuevoDocumento])
      onReset()
    } else {
      toast.error('Selecciona un tipo de archivo y subí un documento')
    }
  }

  const onDelete = (index) => {
    const newDocumentos = documentos.filter((_, i) => i !== index)
    setDocumentos(newDocumentos)
    dispatch(onDeleteDocumento(index))
  }

  return (
    <>
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
              disabled={disabled}
              onChange={handleInputChange}
            />
            <div>
              <label htmlFor='archivo' className='form-label'>Archivo</label>
              <FileInput
                type='file'
                id='archivo'
                name='archivo'
                onChange={handleInputChange}
                disabled={disabled}
                accept='.docx,.doc,.xlsx,.ppt,.jpeg,.jpg,.png'
              />
            </div>
          </div>
          <div className='flex justify-end mt-4 gap-4'>
            <button
              type='button'
              className='btn btn-primary rounded-lg'
              onClick={agregarDocumento}
              disabled={disabled}
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
                <th className='px-4 py-2 text-center dark:text-white'>Nombre de Archivo</th>
                <th className='px-4 py-2 text-center dark:text-white'>Usuario de Carga</th>
                <th className='px-4 py-2 text-center dark:text-white'>Acciones</th>
              </tr>
            </thead>
            <tbody className='divide-y dark:divide-gray-700'>
              {documentos.map((documento, index) => (
                <tr key={index} className='bg-white dark:bg-gray-800 dark:border-gray-700'>
                  <td className='px-4 py-2 text-center dark:text-white'>{documento.fecha_carga}</td>
                  <td className='px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-center'>
                    {documento.tipo_documento_id}
                  </td>
                  <td className='px-4 py-2 text-center dark:text-white'>
                    <a href={documento.url} target='_blank' rel='noopener noreferrer' className='text-blue-500 underline'>
                      {documento.archivo}
                    </a>
                  </td>
                  <td className='px-4 py-2 text-center dark:text-white'>{user.nombre}</td>
                  <td className='text-center py-2'>
                    <Tooltip content='Eliminar'>
                      <button
                        type='button'
                        onClick={() => onDelete(index)}
                        className=' text-red-600 hover:text-red-900'
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
    </>
  )
}

export default DocumentacionAdicionalData
