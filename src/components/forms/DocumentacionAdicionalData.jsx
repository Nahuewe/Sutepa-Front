import Card from '@/components/ui/Card'
import { SelectForm } from '@/components/sutepa/forms'
import { useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import Tooltip from '@/components/ui/Tooltip'
import { toast } from 'react-toastify'

const tipoArchivo = [
  { id: 'ACTA_DEFUNCION', nombre: 'Acta de Defuncion' },
  { id: 'CERTIFICADO_DE_MATRIMONIO', nombre: 'Certificado de Matrimonio' },
  { id: 'CERTIFICADO_DE_NACIMIENTO', nombre: 'Certificado de Nacimiento' },
  { id: 'CONSTANCIA_DE_ALUMNO_REGULAR', nombre: 'Constancia de Alumno Regular' },
  { id: 'FORMULARIO_DE_ALTA', nombre: 'Formulario de Alta' },
  { id: 'FOTOCOPIA_DEL_DNI', nombre: 'Fotocopia del DNI' },
  { id: 'TELEGRAMA_DE_BAJA', nombre: 'Telegrama de Baja' }
]

function DocumentacionAdicionalData ({ register, errors, disabled }) {
  const [documentos, setDocumentos] = useState([])
  const [formData, setFormData] = useState({
    tipoArchivo: '',
    archivo: null
  })

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    })
  }

  const agregarDocumento = () => {
    if (!formData.tipoArchivo || !formData.archivo) {
      toast.error('Por favor, complete todos los campos obligatorios.')
      return
    }

    const nuevoDocumento = {
      tipoArchivo: formData.tipoArchivo,
      archivo: formData.archivo,
      url: URL.createObjectURL(formData.archivo)
    }
    setDocumentos([...documentos, nuevoDocumento])
    setFormData({ tipoArchivo: '', archivo: null })
  }

  const eliminarDocumento = (index) => {
    const nuevosDocumentos = documentos.filter((_, i) => i !== index)
    setDocumentos(nuevosDocumentos)
  }

  return (
    <>
      <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
        Documentación Adicional
      </h4>

      <Card>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <SelectForm
            register={register('tipoArchivo')}
            title='Tipo de Archivo'
            options={tipoArchivo}
            value={formData.tipoArchivo}
            onChange={(e) => setFormData({ ...formData, tipoArchivo: e.target.value })}
            disabled={disabled}
          />
          <div>
            <label htmlFor='archivo' className='form-label'>Archivo</label>
            <input
              type='file'
              id='archivo'
              className='form-control'
              name='archivo'
              onChange={handleInputChange}
              disabled={disabled}
            />
          </div>
        </div>
        <div className='flex justify-end mt-4'>
          <button
            type='button'
            className='btn btn-primary'
            onClick={agregarDocumento}
            disabled={disabled}
          >
            Agregar
          </button>
        </div>
      </Card>

      {documentos.length > 0 && (
        <div className='overflow-x-auto mt-4'>
          <table className='table-auto w-full'>
            <thead className='bg-gray-300 dark:bg-gray-700'>
              <tr>
                <th className='px-4 py-2 text-center dark:text-white'>Tipo de Archivo</th>
                <th className='px-4 py-2 text-center dark:text-white'>Nombre de Archivo</th>
                <th className='px-4 py-2 text-center dark:text-white'>Acciones</th>
              </tr>
            </thead>
            <tbody className='divide-y dark:divide-gray-700'>
              {documentos.map((documento, index) => (
                <tr key={index} className='bg-white dark:bg-gray-800 dark:border-gray-700'>
                  <td className='px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-center'>
                    {documento.tipoArchivo}
                  </td>
                  <td className='px-4 py-2 text-center dark:text-white'>
                    <a href={documento.url} target='_blank' rel='noopener noreferrer' className='text-blue-500 underline'>
                      {documento.archivo.name}
                    </a>
                  </td>
                  <td className='px-4 py-2 text-center dark:text-white'>
                    <Tooltip content='Eliminar'>
                      <button className='btn btn-danger' onClick={() => eliminarDocumento(index)} disabled={disabled}>
                        <Icon icon='heroicons:trash' />
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
