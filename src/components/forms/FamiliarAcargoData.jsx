import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Numberinput from '@/components/ui/Numberinput'
import { SelectForm } from '@/components/sutepa/forms'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_red.css'
import { useState, useEffect } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import { Icon } from '@iconify/react/dist/iconify.js'
import { toast } from 'react-toastify'

const parentescoOptions = [
  { id: 'ABUELE', nombre: 'Abuele' },
  { id: 'AHIJADE', nombre: 'Ahijade' },
  { id: 'CONCUBINE', nombre: 'Concubine' },
  { id: 'CONYUGE', nombre: 'Conyuge' },
  { id: 'HERMANE', nombre: 'Hermane' },
  { id: 'HIJE', nombre: 'Hije' },
  { id: 'MADRE', nombre: 'Madre' },
  { id: 'NIETE', nombre: 'Niete' },
  { id: 'PADRE', nombre: 'Padre' },
  { id: 'SOBRINE', nombre: 'Sobrine' }
]

const tipoDocumento = [
  { id: 'DNI', nombre: 'DNI' },
  { id: 'LIBRETA_DE_ENROLAMIENTO', nombre: 'Libreta de Enrolamiento' },
  { id: 'LIBRETA_CIVICA', nombre: 'Libreta Civica' },
  { id: 'PASAPORTE', nombre: 'Pasaporte' }
]

const flatpickrOptions = {
  dateFormat: 'd/m/Y',
  locale: {
    firstDayOfWeek: 1,
    weekdays: {
      shorthand: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
      longhand: [
        'Domingo',
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado'
      ]
    },
    months: {
      shorthand: [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
      ],
      longhand: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]
    }
  }
}

function FamiliarAcargoData ({ register, setValue, errors, disabled }) {
  const [picker, setPicker] = useState(null)
  const [familiares, setFamiliares] = useState([])
  const [dni, setDni] = useState('')
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    tipoDocumento: '',
    documento: '',
    parentesco: ''
  })

  useEffect(() => {
    register('fechaNacimiento')
    register('DNI')
    register('nombreFamiliar')
    register('documentoFamiliar')
  }, [register])

  const handleDateChange = (date) => {
    setPicker(date)
    const formattedDate = date[0].toLocaleDateString('es-ES')
    setValue('fechaNacimiento', formattedDate)
    setFormData({ ...formData, fechaNacimiento: formattedDate })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleDniChange = (e) => {
    const value = e.target.value
    const cleanedValue = value.replace(/[^\d]/g, '')
    const dniFormat = /^(\d{1,2})(\d{3})(\d{3})$/ // Actualización de la expresión regular
    let formattedDni = ''
    const maxLength = 8

    if (cleanedValue.length > maxLength) {
      return
    }

    if (cleanedValue.length > 1 && cleanedValue.length <= 9) {
      if (cleanedValue.length <= 5) {
        formattedDni = cleanedValue.replace(dniFormat, '$1.$2.$3')
      } else {
        formattedDni = cleanedValue.replace(dniFormat, '$1.$2.$3')
      }
    } else {
      formattedDni = cleanedValue
    }

    setDni(formattedDni)
    setValue('documentoFamiliar', formattedDni)
    setFormData({ ...formData, documentoFamiliar: formattedDni })
  }

  const agregarFamiliar = () => {
    if (
      formData.nombreFamiliar === '' ||
      formData.fechaNacimiento === '' ||
      formData.parentesco === ''
    ) {
      toast.error('Por favor, complete todos los campos obligatorios.')
      return
    }

    setFamiliares([...familiares, formData])
    setFormData({
      nombreFamiliar: '',
      fechaNacimiento: '',
      tipoDocumentoFamiliar: '',
      documentoFamiliar: '',
      parentesco: ''
    })
    setPicker(null)
    setDni('')
  }

  const eliminarFamiliar = (index) => {
    const nuevosFamiliares = familiares.filter((_, i) => i !== index)
    setFamiliares(nuevosFamiliares)
  }

  return (
    <>
      <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
        Familiares a Cargo
      </h4>

      <Card>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label htmlFor='nombre' className='form-label'>
              Nombre y Apellido
              <strong className='obligatorio'>(*)</strong>
            </label>
            <Textinput
              name='nombreFamiliar'
              type='text'
              register={register}
              placeholder='Ingrese el nombre y apellido'
              error={errors.nombreFamiliar}
              value={formData.nombreFamiliar}
              onChange={handleInputChange}
              disabled={disabled}
            />
          </div>

          <div>
            <label htmlFor='fechaNacimiento' className='form-label'>
              Fecha de Nacimiento
              <strong className='obligatorio'>(*)</strong>
            </label>
            <Flatpickr
              options={flatpickrOptions}
              className='form-control py-2 flatPickrBG dark:flatPickrBGDark dark:placeholder-white placeholder-black-500'
              value={picker}
              id='fechaNacimiento'
              placeholder='Ingrese la fecha de nacimiento'
              error={errors.fechaNacimiento}
              onChange={handleDateChange}
              disabled={disabled}
            />
            <input type='hidden' {...register('fechaNacimiento')} />
          </div>

          <SelectForm
            register={register('tipoDocumento')}
            title='Tipo de Documento'
            options={tipoDocumento}
            error={errors.tipoDocumentoFamiliar}
            value={formData.tipoDocumentoFamiliar}
            onChange={(e) => setFormData({ ...formData, tipoDocumentoFamiliar: e.target.value })}
            disabled={disabled}
          />

          <Numberinput
            label='Documento'
            register={register}
            id='documentoFamiliar'
            placeholder='Ingrese el documento'
            value={dni}
            error={errors.documentoFamiliar}
            onChange={handleDniChange}
            disabled={disabled}
          />

          <div>
            <label htmlFor='parentesco' className='form-label'>
              Tipo de Parentesco
              <strong className='obligatorio'>(*)</strong>
            </label>
            <SelectForm
              register={register('parentesco')}
              options={parentescoOptions}
              error={errors.parentesco}
              value={formData.parentesco}
              onChange={(e) => setFormData({ ...formData, parentesco: e.target.value })}
              disabled={disabled}
            />
          </div>
        </div>
        <div className='flex justify-end mt-4'>
          <button
            type='button'
            className='btn btn-primary'
            onClick={agregarFamiliar}
            disabled={disabled}
          >
            Agregar
          </button>
        </div>
      </Card>

      {familiares.length > 0 && (
        <div className='overflow-x-auto'>
          <table className='table-auto w-full'>
            <thead className='bg-gray-300 dark:bg-gray-700'>
              <tr>
                <th className='px-4 py-2 text-center dark:text-white'>Nombre y Apellido</th>
                <th className='px-4 py-2 text-center dark:text-white'>Fecha de Nacimiento</th>
                <th className='px-4 py-2 text-center dark:text-white'>Tipo de Documento</th>
                <th className='px-4 py-2 text-center dark:text-white'>Documento</th>
                <th className='px-4 py-2 text-center dark:text-white'>Parentesco</th>
                <th className='px-4 py-2 text-center dark:text-white'>Acciones</th>
              </tr>
            </thead>
            <tbody className='divide-y dark:divide-gray-700'>
              {familiares.map((familiar, index) => (
                <tr key={index} className='bg-white dark:bg-gray-800 dark:border-gray-700'>
                  <td className='px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-center'>
                    {familiar.nombreFamiliar}
                  </td>
                  <td className='px-4 py-2 text-center dark:text-white'>{familiar.fechaNacimiento}</td>
                  <td className='px-4 py-2 text-center dark:text-white'>{familiar.tipoDocumento}</td>
                  <td className='px-4 py-2 text-center dark:text-white'>{familiar.documento}</td>
                  <td className='px-4 py-2 text-center dark:text-white'>{familiar.parentesco}</td>
                  <td className='px-4 py-2 text-center dark:text-white'>
                    <Tooltip content='Eliminar'>
                      <button className='btn btn-danger' onClick={() => eliminarFamiliar(index)} disabled={disabled}>
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

export default FamiliarAcargoData
