import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SelectForm } from '@/components/sutepa/forms'
import { updatePersona } from '@/store/afiliado'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Numberinput from '@/components/ui/Numberinput'
import DatePicker from '../ui/DatePicker'
import moment from 'moment/moment'
import useFetchData from '@/helpers/useFetchData'
import Loading from '@/components/Loading'

const tipoDocumento = [
  { id: 'DNI', nombre: 'DNI' },
  { id: 'PASAPORTE', nombre: 'PASAPORTE' }
]

const initialForm = {
  sexo_id: null,
  estado_civil_id: null,
  nacionalidad_id: null
}

function DatosPersonalesData ({ register, setValue, errors, watch }) {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { activeAfiliado } = useSelector(state => state.afiliado)
  const [picker, setPicker] = useState(null)
  const [picker2, setPicker2] = useState(null)
  const [cuil, setCuil] = useState('')
  const [dni, setDni] = useState('')
  const [legajo, setLegajo] = useState('')
  const [formData, setFormData] = useState(initialForm)
  const [correoElectronico, setCorreoElectronico] = useState('')
  const [telefono, setTelefono] = useState('')
  const { estadoCivil, nacionalidad, sexo } = useFetchData()
  const [isLoading, setIsLoading] = useState(true)

  const handleDateChange = (date, field) => {
    if (field === 'fecha_afiliacion') {
      setPicker(date)
      setValue(field, date)
    } else if (field === 'fecha_nacimiento') {
      setPicker2(date)
      setValue(field, date)
    }
  }

  const handleChange = (setter) => (e) => {
    const value = e.target.value
    setter(value)
    setValue(e.target.name, value)
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
    const legajoLimited = cleanedValue.slice(0, maxLength)

    setLegajo(legajoLimited)
    setValue('legajo', legajoLimited)
  }

  const handleSelectChange = (field, e) => {
    const { value } = e.target
    const fieldValue = parseInt(value)
    setFormData((prevState) => ({
      ...prevState,
      [field]: fieldValue
    }))
    setValue(field, fieldValue)
  }

  useEffect(() => {
    if (activeAfiliado) {
      const { persona } = activeAfiliado

      setLegajo(persona.legajo || '')
      setCuil(persona.cuil || '')
      setDni(persona.dni || '')
      setCorreoElectronico(persona.email || '')
      setTelefono(persona.telefono || '')

      setPicker(persona.fecha_afiliacion ? moment(persona.fecha_afiliacion).toDate() : null)
      setPicker2(persona.fecha_nacimiento ? moment(persona.fecha_nacimiento).toDate() : null)
      setFormData({
        sexo_id: persona.sexo_id || null,
        estado_civil_id: persona.estado_civil_id || null,
        nacionalidad_id: persona.nacionalidad_id || null
      })

      for (const key in persona) {
        setValue(key, persona[key])
      }
    }
  }, [activeAfiliado, setValue])

  useEffect(() => {
    const personaData = {
      legajo,
      fecha_afiliacion: picker ? moment(picker).format('YYYY-MM-DD') : null,
      nombre: watch('nombre'),
      apellido: watch('apellido'),
      sexo_id: parseInt(watch('sexo_id')) || null,
      fecha_nacimiento: picker2 ? moment(picker2).format('YYYY-MM-DD') : null,
      estado_civil_id: parseInt(watch('estado_civil_id')) || null,
      tipo_documento: watch('tipo_documento') || null,
      dni,
      cuil,
      email: watch('email') || null,
      telefono,
      nacionalidad_id: parseInt(watch('nacionalidad_id')) || null,
      users_id: user.id
    }

    dispatch(updatePersona(personaData))
  }, [picker, picker2, legajo, dni, cuil, correoElectronico, telefono, watch('nombre'), watch('apellido'), watch('sexo_id'), watch('estado_civil_id'), watch('tipo_documento'), watch('nacionalidad_id'), watch('email'), dispatch, user.id])

  useEffect(() => {
    if (estadoCivil.length && nacionalidad.length && sexo.length) {
      setIsLoading(false)
    }
  }, [estadoCivil, nacionalidad, sexo])

  return (
    <>
      {isLoading
        ? (
          <Loading className='mt-28 md:mt-64' />
          )
        : (
          <div>
            <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
              Datos Personales
            </h4>

            <Card>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='legajo' className='form-label'>
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
                  />
                </div>

                <div>
                  <label htmlFor='default-picker' className='form-label'>
                    Fecha de Afiliación
                  </label>
                  <DatePicker
                    value={picker}
                    id='fecha_afiliacion'
                    className='mayuscula'
                    placeholder='Seleccione la fecha de afiliación'
                    onChange={(date) => handleDateChange(date, 'fecha_afiliacion')}
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
                    className='mayuscula'
                    register={register}
                    placeholder='Ingrese el nombre'
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
                    className='mayuscula'
                    register={register}
                    placeholder='Ingrese el apellido'
                    error={errors.apellido}
                  />
                </div>

                <SelectForm
                  register={register('sexo_id')}
                  title='Sexo'
                  options={sexo}
                  onChange={(e) => handleSelectChange('sexo_id', e)}
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
                  />
                  <input type='hidden' {...register('fecha_nacimiento')} />
                </div>

                <SelectForm
                  register={register('estado_civil_id')}
                  title='Estado Civil'
                  options={estadoCivil}
                  onChange={(e) => handleSelectChange('estado_civil_id', e)}
                />

                <SelectForm
                  register={register('nacionalidad_id')}
                  title='Nacionalidad'
                  options={nacionalidad}
                  onChange={(e) => handleSelectChange('nacionalidad_id', e)}
                />

                <div>
                  <label htmlFor='default-picker' className='form-label'>
                    Tipo de Documento
                  </label>
                  <SelectForm
                    register={register('tipo_documento')}
                    options={tipoDocumento}
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
                    error={errors.dni}
                    onChange={handleDniChange}
                  />
                </div>

                <div>
                  <label htmlFor='default-picker' className='form-label'>
                    CUIL
                    <strong className='obligatorio'>(*)</strong>
                  </label>
                  <Numberinput
                    register={register}
                    id='cuil'
                    placeholder='Ingrese el CUIL'
                    value={cuil}
                    error={errors.cuil}
                    onChange={handleCuilChange}
                  />
                </div>

                <Textinput
                  label='Correo Electrónico'
                  register={register}
                  id='email'
                  name='email'
                  type='email'
                  placeholder='Ingrese el correo electrónico'
                  onChange={(e) => setCorreoElectronico(e.target.value)}
                />

                <Numberinput
                  label='Teléfono'
                  register={register}
                  id='telefono'
                  type='number'
                  placeholder='Ingrese el número de teléfono'
                  value={telefono}
                  onChange={handleChange(setTelefono)}
                />
              </div>
            </Card>
          </div>
          )}
    </>
  )
}

export default DatosPersonalesData
