import React, { useState } from 'react'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Numberinput from '@/components/ui/Numberinput'
import { SelectForm } from '@/components/sutepa/forms'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_red.css'
import { useSelector, useDispatch } from 'react-redux'
import { onAddFamiliar, onDeleteFamiliar } from '../../store/ingreso'
import { Icon } from '@iconify/react'
import { Tooltip } from 'flowbite-react'

const initialForm = {
  id: null,
  nombre_familiar: '',
  fecha_nacimiento: '',
  tipo_documento_familiar: '',
  documentoFamiliar: '',
  parentesco: ''
}

const parentescoOptions = [
  { id: 'ABUELO', nombre: 'ABUELO' },
  { id: 'AHIJADO', nombre: 'AHIJADO' },
  { id: 'CONCUBINO', nombre: 'CONCUBINO' },
  { id: 'CONYUGE', nombre: 'CONYUGE' },
  { id: 'HERMANO', nombre: 'HERMANO' },
  { id: 'HIJO', nombre: 'HIJO' },
  { id: 'MADRE', nombre: 'MADRE' },
  { id: 'NIETO', nombre: 'NIETO' },
  { id: 'PADRE', nombre: 'PADRE' },
  { id: 'SOBRINO', nombre: 'SOBRINO' }
]

const tipoDocumento = [
  { id: 'DNI', nombre: 'DNI' },
  { id: 'PASAPORTE', nombre: 'Pasaporte' }
]

const flatpickrOptions = {
  dateFormat: 'd-m-Y',
  locale: {
    firstDayOfWeek: 1,
    weekdays: {
      shorthand: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
      longhand: [
        'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
      ]
    },
    months: {
      shorthand: [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
      ],
      longhand: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]
    }
  }
}

function FamiliarAcargoData ({ register, disabled }) {
  const dispatch = useDispatch()
  const { familiares } = useSelector(state => state.ingreso)
  const { user } = useSelector(state => state.auth)
  const [picker, setPicker] = useState(null)
  const [dni, setDni] = useState('')
  const [formData, setFormData] = useState(initialForm)

  function onDelete (id) {
    dispatch(onDeleteFamiliar(id))
  }

  function onReset () {
    setFormData(initialForm)
    setPicker(null)
    setDni('')
  }

  const addFamiliar = () => {
    const newFamiliar = {
      ...formData,
      id: Date.now(),
      fecha_carga: new Date().toLocaleDateString('es-ES')
    }
    dispatch(onAddFamiliar(newFamiliar))
    onReset()
  }

  const handleDateChange = (date) => {
    setPicker(date)
    const formattedDate = date[0].toLocaleDateString('es-ES')
    setFormData((prevData) => ({ ...prevData, fecha_nacimiento: formattedDate }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

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
      if (cleanedValue.length <= 5) {
        formattedDni = cleanedValue.replace(dniFormat, '$1.$2.$3')
      } else {
        formattedDni = cleanedValue.replace(dniFormat, '$1.$2.$3')
      }
    } else {
      formattedDni = cleanedValue
    }

    setDni(formattedDni)
    setFormData((prevData) => ({ ...prevData, documentoFamiliar: formattedDni }))
  }

  return (
    <>
      <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
        Familiares a Cargo
      </h4>

      <Card>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label htmlFor='nombre_familiar' className='form-label'>
              Nombre y Apellido
            </label>
            <Textinput
              name='nombre_familiar'
              type='text'
              register={register}
              placeholder='Ingrese el nombre y apellido'
              value={formData.nombre_familiar}
              onChange={handleInputChange}
              disabled={disabled}
            />
          </div>

          <div>
            <label htmlFor='fecha_nacimiento' className='form-label'>
              Fecha de Nacimiento
            </label>
            <Flatpickr
              options={flatpickrOptions}
              className='form-control py-2 flatPickrBG dark:flatPickrBGDark dark:placeholder-white placeholder-black-500'
              value={picker}
              id='fecha_nacimiento'
              placeholder='Ingrese la fecha de nacimiento'
              onChange={handleDateChange}
              disabled={disabled}
            />
            <input type='hidden' {...register('fecha_nacimiento')} />
          </div>

          <SelectForm
            register={register('tipo_documento_familiar')}
            title='Tipo de Documento'
            options={tipoDocumento}
            value={formData.tipo_documento_familiar}
            onChange={(e) => setFormData({ ...formData, tipo_documento_familiar: e.target.value })}
            disabled={disabled}
          />

          <Numberinput
            label='Documento'
            register={register}
            id='documentoFamiliar'
            placeholder='Ingrese el documento'
            value={dni}
            onChange={handleDniChange}
            disabled={disabled}
          />

          <div>
            <label htmlFor='parentesco' className='form-label'>
              Parentesco
            </label>
            <SelectForm
              register={register('parentesco')}
              options={parentescoOptions}
              value={formData.parentesco}
              onChange={(e) => setFormData({ ...formData, parentesco: e.target.value })}
              disabled={disabled}
            />
          </div>
        </div>
        <div className='flex justify-end mt-4'>
          <button
            type='button'
            className='btn btn-primary rounded-lg'
            onClick={addFamiliar}
            disabled={disabled}
          >
            Agregar Familiar
          </button>
        </div>
      </Card>

      {
        familiares.length > 0 && (
          <div className='overflow-x-auto mt-4'>
            <table className='table-auto w-full'>
              <thead className='bg-gray-300 dark:bg-gray-700'>
                <tr>
                  <th className='px-4 py-2 text-center dark:text-white'>Fecha de Carga</th>
                  <th className='px-4 py-2 text-center dark:text-white'>Nombre y Apellido</th>
                  <th className='px-4 py-2 text-center dark:text-white'>Fecha de Nacimiento</th>
                  <th className='px-4 py-2 text-center dark:text-white'>Tipo de Documento</th>
                  <th className='px-4 py-2 text-center dark:text-white'>Documento</th>
                  <th className='px-4 py-2 text-center dark:text-white'>Parentesco</th>
                  <th className='px-4 py-2 text-center dark:text-white'>Usuario de Carga</th>
                  <th className='px-4 py-2 text-center dark:text-white'>Acciones</th>
                </tr>
              </thead>
              <tbody className='divide-y dark:divide-gray-700'>
                {familiares.map((fam) => (
                  <tr key={fam.id} className='bg-white dark:bg-gray-800 dark:border-gray-700'>
                    <td className='px-4 py-2 text-center dark:text-white'>{fam.fecha_carga}</td>
                    <td className='px-4 py-2 text-center dark:text-white'>{fam.nombre_familiar}</td>
                    <td className='px-4 py-2 text-center dark:text-white'>{fam.fecha_nacimiento}</td>
                    <td className='px-4 py-2 text-center dark:text-white'>{fam.tipo_documento_familiar}</td>
                    <td className='px-4 py-2 text-center dark:text-white'>{fam.documentoFamiliar}</td>
                    <td className='px-4 py-2 text-center dark:text-white'>{fam.parentesco}</td>
                    <td className='px-4 py-2 text-center dark:text-white'>{user.nombre}</td>
                    <td className='text-center py-2'>
                      <Tooltip content='Eliminar'>
                        <button
                          type='button'
                          onClick={() => onDelete(fam.id)}
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
        )
      }
    </>
  )
}

export default FamiliarAcargoData
