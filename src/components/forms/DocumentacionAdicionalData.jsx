import Card from '@/components/ui/Card'
import { SelectForm } from '@/components/sutepa/forms'
import { useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import Tooltip from '@/components/ui/Tooltip'
import { toast } from 'react-toastify'
import { FileInput } from 'flowbite-react'
import { onAddDocumento, onDeleteDocumento } from '../../store/ingreso'
import { useDispatch, useSelector } from 'react-redux'

const initialForm = {
  id: null,
  tipo_archivo: '',
  archivo: null,
  url: null
}

const tipoArchivo = [
  { id: 'ACTA_DEFUNCION', nombre: 'ACTA DE DEFUNCION' },
  { id: 'CERTIFICADO_DE_MATRIMONIO', nombre: 'CERTIFICADO DE MATRIMONIO' },
  { id: 'CERTIFICADO_DE_NACIMIENTO', nombre: 'CERTIFICADO DE NACIMIENTO' },
  { id: 'CONSTANCIA_DE_ALUMNO_REGULAR', nombre: 'CONSTANCIA DE ALUMNO REGULAR' },
  { id: 'FORMULARIO_DE_ALTA', nombre: 'FORMULARIO DE ALTA' },
  { id: 'FOTOCOPIA_DEL_DNI', nombre: 'FOTOCOPIA DEL DNI' },
  { id: 'TELEGRAMA_DE_BAJA', nombre: 'TELEGRAMA DE BAJA' }
]

function DocumentacionAdicionalData ({ register, disabled }) {
  const dispatch = useDispatch()
  const [documentos, setDocumentos] = useState([])
  const { user } = useSelector(state => state.auth)
  const [formData, setFormData] = useState(initialForm)

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    })
  }

  function onReset () {
    setFormData(initialForm)
  }

  const agregarDocumento = (documento) => {
    // Verificar si ambos campos están llenos
    if (formData.tipo_archivo && formData.archivo) {
      const nuevoDocumento = {
        ...formData,
        id: Date.now(),
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

  return (
    <>
      <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
        Documentación Adicional
      </h4>

      <Card>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <SelectForm
            register={register('tipo_archivo')}
            title='Tipo de Archivo'
            options={tipoArchivo}
            value={formData.tipo_archivo}
            onChange={(e) => setFormData({ ...formData, tipo_archivo: e.target.value })}
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
            />
          </div>
        </div>
        <div className='flex justify-end mt-4'>
          <button
            type='button'
            className='btn btn-primary rounded-lg'
            onClick={agregarDocumento}
            disabled={disabled}
          >
            Agregar Documento
          </button>
        </div>
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
