import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Numberinput from '@/components/ui/Numberinput'
import { SelectForm } from '@/components/sutepa/forms'
import Flatpickr from 'react-flatpickr'
import { useState, useEffect } from 'react'
import 'flatpickr/dist/themes/material_red.css'

const sexo = [
  {
    id: 'HOMBRE',
    nombre: 'HOMBRE'
  },
  {
    id: 'MUJER',
    nombre: 'MUJER'
  },
  {
    id: 'NO INFORMA',
    nombre: 'NO INFORMA'
  }
]

const estadoCivil = [
  {
    id: 'CASADE',
    nombre: 'CASADE'
  },
  {
    id: 'CONCUBINE',
    nombre: 'CONCUBINE'
  },
  {
    id: 'DIVORCIADE',
    nombre: 'DIVORCIADE'
  },
  {
    id: 'SOLTERE',
    nombre: 'SOLTERE'
  },
  {
    id: 'VIUDE',
    nombre: 'VIUDE'
  }
]

const nacionalidad = [
  {
    id: 'ARGENTINO',
    nombre: 'ARGENTINO'
  },
  {
    id: 'CHILENO',
    nombre: 'CHILENO'
  },
  {
    id: 'BOLIVIANO',
    nombre: 'BOLIVIANO'
  },
  {
    id: 'PERUANO',
    nombre: 'PERUANO'
  },
  {
    id: 'PARAGUAYO',
    nombre: 'PARAGUAYO'
  }
]

const tipoDocumento = [
  { id: 'DNI', nombre: 'DNI' },
  { id: 'LIBRETA_DE_ENROLAMIENTO', nombre: 'Libreta de Enrolamiento' },
  { id: 'LIBRETA_CIVICA', nombre: 'Libreta Civica' },
  { id: 'PASAPORTE', nombre: 'Pasaporte' }
]

const flatpickrOptions = {
  dateFormat: 'd-m-Y',
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
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic'
      ],
      longhand: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
      ]
    }
  }
}

function DatosPersonalesData ({ register, setValue, errors }) {
  const [picker, setPicker] = useState(null)
  const [picker2, setPicker2] = useState(null)
  const [cuil, setCuil] = useState('')
  const [dni, setDni] = useState('')
  const [legajo, setLegajo] = useState('')
  const [correoElectronico, setCorreoElectronico] = useState('')
  const [telefono, setTelefono] = useState('')

  useEffect(() => {
    register('fechaAfiliacion')
    register('fechaNacimiento')
    register('DNI')
    register('CUIL')
    register('legajo')
    register('correoElectronico')
    register('telefono')
  }, [register])

  const handleDateChange = (date, field) => {
    if (field === 'fechaAfiliacion') {
      setPicker(date)
      setValue(field, date[0])
    } else if (field === 'fechaNacimiento') {
      setPicker2(date)
      setValue(field, date[0])
    }
  }

  const handleCuilChange = (e) => {
    const value = e.target.value
    const cleanedValue = value.replace(/[^\d]/g, '')
    const cuilFormat = /^(\d{2})(\d{7}|\d{8})(\d{1})$/
    let formattedCuil = ''
    const maxLength = 11

    if (cleanedValue.length > maxLength) {
      return
    }

    if (cleanedValue.length > 2 && cleanedValue.length <= 11) {
      formattedCuil = cleanedValue.replace(cuilFormat, '$1-$2-$3')
    } else {
      formattedCuil = cleanedValue
    }

    setCuil(formattedCuil)
    setValue('CUIL', formattedCuil)
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
    setValue('DNI', formattedDni)
  }

  const handleLegajoChange = (e) => {
    const value = e.target.value
    setLegajo(value)
    setValue('legajo', value)
  }

  const handleCorreoElectronicoChange = (e) => {
    const value = e.target.value
    setCorreoElectronico(value)
    setValue('correoElectronico', value)
  }

  const handleTelefonoChange = (e) => {
    const value = e.target.value
    setTelefono(value)
    setValue('telefono', value)
  }

  return (
    <>
      <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
        Datos Personales
      </h4>

      <Card>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label htmlFor='default-picker' className='form-label'>
              Legajo
              <strong className='obligatorio'>(*)</strong>
            </label>
            <Numberinput
              name='legajo'
              type='number'
              value={legajo}
              onChange={handleLegajoChange}
              placeholder='Legajo'
              error={errors.legajo}
            />
          </div>

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Fecha de Afiliacion
              <strong className='obligatorio'>(*)</strong>
            </label>
            <Flatpickr
              options={flatpickrOptions}
              className='form-control py-2 flatPickrBG dark:flatPickrBGDark'
              value={picker}
              id='fechaAfiliacion'
              placeholder='Fecha de Afiliacion'
              error={errors.fechaAfiliacion}
              onChange={(date) => handleDateChange(date, 'fechaAfiliacion')}
            />
            <input type='hidden' {...register('fechaAfiliacion')} />
          </div>

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Nombre
              <strong className='obligatorio'>(*)</strong>
            </label>
            <Textinput
              name='nombre'
              type='text'
              register={register}
              placeholder='Nombre'
              error={errors.nombre}
            />
          </div>

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Apellido
              <strong className='obligatorio'>(*)</strong>
            </label>
            <Textinput
              name='apellido'
              type='text'
              register={register}
              placeholder='Apellido'
              error={errors.apellido}
            />
          </div>

          <SelectForm
            register={register('sexo')}
            title='Sexo'
            options={sexo}
            error={errors.sexo}
          />

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Fecha de Nacimiento
            </label>
            <Flatpickr
              options={flatpickrOptions}
              className='form-control py-2 flatPickrBG dark:flatPickrBGDark'
              value={picker2}
              id='fechaNacimiento'
              placeholder='Fecha de Nacimiento'
              error={errors.fechaNacimiento}
              onChange={(date) => handleDateChange(date, 'fechaNacimiento')}
            />
            <input type='hidden' {...register('fecha Nacimiento')} />
          </div>

          <SelectForm
            register={register('estadoCivil')}
            title='Estado Civil'
            options={estadoCivil}
            error={errors.estadoCivil}
          />

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Nacionalidad
              <strong className='obligatorio'>(*)</strong>
            </label>
            <SelectForm
              register={register('nacionalidad')}
              options={nacionalidad}
              error={errors.nacionalidad}
            />
          </div>

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Tipo de Documento
              <strong className='obligatorio'>(*)</strong>
            </label>
            <SelectForm
              register={register('tipoDocumento')}
              options={tipoDocumento}
              error={errors.tipoDocumento}
            />
          </div>

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Documento
              <strong className='obligatorio'>(*)</strong>
            </label>
            <Numberinput
              register={register}
              id='dni'
              placeholder='Documento'
              value={dni}
              error={errors.DNI}
              onChange={handleDniChange}
            />
          </div>

          <Numberinput
            label='CUIL'
            register={register}
            id='cuil'
            placeholder='CUIL'
            error={errors.cuil}
            value={cuil}
            onChange={handleCuilChange}
          />

          <Textinput
            label='Correo Electrónico'
            register={register}
            id='correoElectronico'
            placeholder='Correo Electrónico'
            error={errors.correoElectronico}
            value={correoElectronico}
            onChange={handleCorreoElectronicoChange}
          />

          <Numberinput
            label='Teléfono'
            register={register}
            id='telefono'
            type='number'
            placeholder='Teléfono'
            error={errors.telefono}
            value={telefono}
            onChange={handleTelefonoChange}
          />
        </div>
      </Card>
    </>
  )
}

export default DatosPersonalesData
