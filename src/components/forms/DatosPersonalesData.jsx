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
    id: 'CASADO',
    nombre: 'CASADO'
  },
  {
    id: 'CONCUBINO',
    nombre: 'CONCUBINO'
  },
  {
    id: 'DIVORCIADO',
    nombre: 'DIVORCIADO'
  },
  {
    id: 'SOLTERO',
    nombre: 'SOLTERO'
  },
  {
    id: 'VIUDO',
    nombre: 'VIUDO'
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
  },
  {
    id: 'URUGUAYO',
    nombre: 'URUGUAYO'
  },
  {
    id: 'BRASILEÑO',
    nombre: 'BRASILEÑO'
  }
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

function DatosPersonalesData ({ register, setValue, errors, disabled }) {
  const [picker, setPicker] = useState(null)
  const [picker2, setPicker2] = useState(null)
  const [cuil, setCuil] = useState('')
  const [dni, setDni] = useState('')
  const [legajo, setLegajo] = useState('')
  const [correoElectronico, setCorreoElectronico] = useState('')
  const [telefono, setTelefono] = useState('')

  useEffect(() => {
    register('fecha_afiliacion')
    register('fecha_nacimiento')
    register('dni')
    register('cuil')
    register('legajo')
    register('email')
    register('telefono')
  }, [register])

  const handleDateChange = (date, field) => {
    if (field === 'fecha_afiliacion') {
      setPicker(date)
      setValue(field, date[0])
    } else if (field === 'fecha_nacimiento') {
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
    setValue('cuil', formattedCuil)
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
    setValue('dni', formattedDni)
  }

  const handleLegajoChange = (e) => {
    const value = e.target.value
    const cleanedValue = value.replace(/[^\d]/g, '')
    const maxLength = 5
    
    if (cleanedValue.length > maxLength) {
      return
    }
    
    setLegajo(cleanedValue)
    setValue('legajo', cleanedValue)
  }
  

  const handleCorreoElectronicoChange = (e) => {
    const value = e.target.value
    setCorreoElectronico(value)
    setValue('email', value)
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
              type='text'
              value={legajo}
              onChange={handleLegajoChange}
              placeholder='Ingrese el número de legajo'
              error={errors.legajo}
              disabled={disabled}
            />
          </div>

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Fecha de Afiliacion
            </label>
            <Flatpickr
              options={flatpickrOptions}
              className='form-control py-2 flatPickrBG dark:flatPickrBGDark dark:placeholder-white placeholder-black-500'
              value={picker}
              id='fecha_afiliacion'
              placeholder='Seleccione la fecha de afiliación'
              onChange={(date) => handleDateChange(date, 'fecha_afiliacion')}
              disabled={disabled}
            />
            <input type='hidden' {...register('fecha_afiliacion')} />
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
              placeholder='Ingrese el nombre'
              error={errors.nombre}
              disabled={disabled}
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
              placeholder='Ingrese el apellido'
              error={errors.apellido}
              disabled={disabled}
            />
          </div>

          <SelectForm
            register={register('sexo')}
            title='Sexo'
            options={sexo}
            disabled={disabled}
          />

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Fecha de Nacimiento
            </label>
            <Flatpickr
              options={flatpickrOptions}
              className='form-control py-2 flatPickrBG dark:flatPickrBGDark dark:placeholder-white placeholder-black-500'
              value={picker2}
              id='fecha_nacimiento'
              placeholder='Seleccione la fecha de nacimiento'
              onChange={(date) => handleDateChange(date, 'fecha_nacimiento')}
              disabled={disabled}
            />
            <input type='hidden' {...register('fecha_nacimiento')} />
          </div>

          <SelectForm
            register={register('estado_civil')}
            title='Estado Civil'
            options={estadoCivil}
            disabled={disabled}
          />

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Nacionalidad
            </label>
            <SelectForm
              register={register('nacionalidad_id')}
              options={nacionalidad}
              disabled={disabled}
            />
          </div>

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Tipo de Documento
            </label>
            <SelectForm
              register={register('tipo_documento')}
              options={tipoDocumento}
              disabled={disabled}
            />
          </div>

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Documento
            </label>
            <Numberinput
              register={register}
              id='dni'
              placeholder='Ingrese el número de documento'
              value={dni}
              onChange={handleDniChange}
              disabled={disabled}
            />
          </div>

          <Numberinput
            label='CUIL'
            register={register}
            id='cuil'
            placeholder='Ingrese el CUIL'
            value={cuil}
            onChange={handleCuilChange}
            disabled={disabled}
          />

          <Textinput
            label='Correo Electrónico'
            register={register}
            id='correoElectronico'
            placeholder='Ingrese el correo electrónico'
            className="minuscula"
            value={correoElectronico}
            onChange={handleCorreoElectronicoChange}
            disabled={disabled}
          />

          <Numberinput
            label='Teléfono'
            register={register}
            id='telefono'
            type='number'
            placeholder='Ingrese el número de teléfono'
            value={telefono}
            onChange={handleTelefonoChange}
            disabled={disabled}
          />
        </div>
      </Card>
    </>
  )
}

export default DatosPersonalesData
