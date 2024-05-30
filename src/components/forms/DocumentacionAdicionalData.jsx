import Card from '@/components/ui/Card'
import { SelectForm } from '@/components/sutepa/forms'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import Tooltip from '@/components/ui/Tooltip'
import { toast } from 'react-toastify'
import { FileInput } from 'flowbite-react'
import { onAddDocumento, onDeleteDocumento } from '../../store/ingreso'
import { useDispatch, useSelector } from 'react-redux'
import { sutepaApi } from '../../api'

const initialForm = {
  tipo_archivo: '',
  archivo: null,
  url: null
}

const tipoArchivo = [
  { id: 1, nombre: 'ACTA DE DEFUNCION' },
  { id: 2, nombre: 'CERTIFICADO DE MATRIMONIO' },
  { id: 3, nombre: 'CERTIFICADO DE NACIMIENTO' },
  { id: 4, nombre: 'CONSTANCIA DE ALUMNO REGULAR' },
  { id: 5, nombre: 'FORMULARIO DE ALTA' },
  { id: 6, nombre: 'FOTOCOPIA DEL DNI' },
  { id: 7, nombre: 'TELEGRAMA DE BAJA' }
]

function DocumentacionAdicionalData ({ register, disabled }) {
  const dispatch = useDispatch()
  const [documentos, setDocumentos] = useState([])
  const { user } = useSelector(state => state.auth)
  const [formData, setFormData] = useState(initialForm)
  const formRef = useRef()
  const [archivo, setArchivo] = useState([])

  async function handleArchivo () {
    const response = await sutepaApi.get('archivo')
    const { data } = response.data
    setArchivo(data)
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
  }

  const agregarDocumento = (documento) => {
    // Verificar si ambos campos están llenos
    const tipoArchivoData = tipoArchivo.find(ts => ts.id === Number(formData.tipo_archivo))?.nombre || ''
    if (formData.tipo_archivo && formData.archivo) {
      const nuevoDocumento = {
        ...formData,
        id: Date.now(),
        tipo_archivo: tipoArchivoData,
        fecha_carga: new Date().toLocaleDateString('es-ES'),
        url: URL.createObjectURL(formData.archivo)
      }
      dispatch(onAddDocumento(nuevoDocumento))
      setDocumentos([...documentos, nuevoDocumento])
      setFormData({
        ...formData,
        id: documento.id,
        tipo_archivo: documento.tipo_archivo || '',
        archivo: documento.archivo || ''
      })
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

  useEffect(() => {
    handleArchivo()
  }, [])

  return (
    <>
      <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
        Documentación Adicional
      </h4>

      <Card>
        <form ref={formRef}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <SelectForm
              register={register('tipo_archivo')}
              title='Tipo de Archivo'
              options={archivo}
              disabled={disabled}
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
                    {documento.tipo_archivo}
                  </td>
                  <td className='px-4 py-2 text-center dark:text-white'>
                    <a href={documento.url} target='_blank' rel='noopener noreferrer' className='text-blue-500 underline'>
                      {documento.archivo.name}
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
