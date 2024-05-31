import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Numberinput from '@/components/ui/Numberinput'
import { SelectForm } from '@/components/sutepa/forms'
import { updatePersona } from '../../store/ingreso'
import { sutepaApi } from '../../api'
import DatePicker from '../ui/DatePicker'

const sexo = [
  { id: 1, nombre: 'HOMBRE' },
  { id: 2, nombre: 'MUJER' },
  { id: 3, nombre: 'NO INFORMA' }
]

const tipoDocumento = [
  { id: 'DNI', nombre: 'DNI' },
  { id: 'PASAPORTE', nombre: 'PASAPORTE' }
]

function DatosPersonalesData ({ register, setValue, errors, disabled, watch }) {
  const [picker, setPicker] = useState(null)
  const [picker2, setPicker2] = useState(null)
  const [cuil, setCuil] = useState('')
  const [dni, setDni] = useState('')
  const [legajo, setLegajo] = useState('')
  const [correoElectronico, setCorreoElectronico] = useState('')
  const [telefono, setTelefono] = useState('')
  const dispatch = useDispatch()
  const [estadoCivil, setEstadoCivil] = useState([])
  const [nacionalidad, setNacionalidad] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sutepaApi.get('estadocivil')
        const { data } = response.data
        setEstadoCivil(data)
      } catch (error) {
        console.error('Error fetching estado civil:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sutepaApi.get('nacionalidad')
        const { data } = response.data
        setNacionalidad(data)
      } catch (error) {
        console.error('Error fetching nacionalidad:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const personaData = {
      ...watch('persona'),
      fecha_afiliacion: picker,
      fecha_nacimiento: picker2
    }
    dispatch(updatePersona(personaData))
  }, [picker, picker2, watch, dispatch])

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

  useEffect(() => {
    const legajoValue = watch('legajo')
    const nombreValue = watch('nombre')
    const apellidoValue = watch('apellido')
    const dniValue = watch('dni')
    const estadoCivilIdValue = watch('estado_civil_id')

    const personaData = {
      fecha_afiliacion: picker,
      fecha_nacimiento: picker2,
      dni: dniValue,
      cuil,
      legajo: legajoValue,
      email: correoElectronico,
      telefono,
      nombre: nombreValue,
      apellido: apellidoValue,
      sexo: watch('sexo'),
      estado_civil_id: estadoCivilIdValue,
      nacionalidad_id: watch('nacionalidad_id'),
      tipo_documento: watch('tipo_documento')
    }

    dispatch(updatePersona(personaData))
  }, [picker, picker2, cuil, correoElectronico, telefono, watch, dispatch])
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
            <DatePicker
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
            <DatePicker
              value={picker2}
              id='fecha_nacimiento'
              placeholder='Seleccione la fecha de nacimiento'
              onChange={(date) => handleDateChange(date, 'fecha_nacimiento')}
              disabled={disabled}
            />
            <input type='hidden' {...register('fecha_nacimiento')} />
          </div>

          <div>
            <SelectForm
              register={register('estado_civil_id')}
              title='Estado Civil'
              options={estadoCivil}
              disabled={disabled}
            />
          </div>

          <div>
            <SelectForm
              register={register('nacionalidad_id')}
              title='Nacionalidad'
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
              <strong className='obligatorio'>(*)</strong>
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
            id='email'
            className='minuscula'
            placeholder='Ingrese el correo electrónico'
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
