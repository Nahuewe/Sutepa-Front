import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '@/components/Loading'
import { SelectForm } from '@/components/sutepa/forms'
import Card from '@/components/ui/Card'
import DatePicker from '@/components/ui/DatePicker'
import Numberinput from '@/components/ui/Numberinput'
import Textinput from '@/components/ui/Textinput'
import useFetchDatosPersonales from '@/fetches/useFetchDatosPersonales'
import { updatePersona } from '@/store/afiliado'

const tipoDocumento = [
  { id: 'DNI', nombre: 'DNI' },
  { id: 'PASAPORTE', nombre: 'PASAPORTE' }
]

const initialForm = {
  sexo_id: null,
  estado_civil_id: null,
  nacionalidad_id: null,
  users_id: null
}

function DatosPersonalesData ({ isLoadingParent, register, setValue, errors, watch }) {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { activeAfiliado } = useSelector(state => state.afiliado)
  const [picker, setPicker] = useState(null)
  const [picker2, setPicker2] = useState(null)
  const [cuil, setCuil] = useState('')
  const [dni, setDni] = useState('')
  const [dniError, setDniError] = useState(null)
  const [legajo, setLegajo] = useState('')
  const [legajoError, setLegajoError] = useState(null)
  const [, setFormData] = useState(initialForm)
  const [correoElectronico, setCorreoElectronico] = useState('')
  const [correoError, setCorreoError] = useState(null)
  const [telefono, setTelefono] = useState('')
  const { estadoCivil, nacionalidad, sexo, legajos } = useFetchDatosPersonales()
  const [, setIsLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  const handleDateChange = (date, field) => {
    if (field === 'fecha_afiliacion') {
      setPicker(date)
      setValue(field, date)
    } else if (field === 'fecha_nacimiento') {
      setPicker2(date)
      setValue(field, date)
    }
  }

  const handleChange = setter => e => {
    const value = e.target.value
    setter(value)
    setValue(e.target.name, value)
  }

  const handleCuilChange = e => {
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
      formattedDni = cleanedValue.replace(dniFormat, '$1.$2.$3')
    } else {
      formattedDni = cleanedValue
    }

    setDni(formattedDni)
    setValue('dni', formattedDni)

    const dniExists = legajos?.length > 0 && legajos.some((item) => item.dni === formattedDni)

    if (dniExists) {
      setDniError('El DNI ya existe')
    } else {
      setDniError(null)
    }
  }

  const handleLegajoChange = (e) => {
    const value = e.target.value
    const cleanedValue = value.replace(/[^\d]/g, '')

    const maxLength = 7
    const legajoLimited = cleanedValue.slice(0, maxLength)

    setLegajo(legajoLimited)
    setValue('legajo', legajoLimited)

    const legajoExists = legajos?.length > 0 && legajos.some((item) => item.legajo === legajoLimited)

    if (legajoExists) {
      setLegajoError('El legajo ya existe')
    } else {
      setLegajoError(null)
    }
  }

  const handleSelectChange = (field, e) => {
    const { value } = e.target
    const fieldValue = parseInt(value)
    setFormData(prevState => ({
      ...prevState,
      [field]: fieldValue
    }))
    setValue(field, fieldValue)
  }

  const extensionesPermitidas = [
    'gmail.com',
    'hotmail.com',
    'yahoo.com.ar',
    'pami.org.ar'
  ]

  const validarCorreoElectronico = (email) => {
    const dominio = email.split('@')[1]
    if (dominio && !extensionesPermitidas.includes(dominio)) {
      setCorreoError('El correo electrónico puede estar mal escrito. Asegúrate de que termine en ".gmail.com", ".hotmail.com", ".yahoo.com.ar", o ".pami.org.ar".')
    } else {
      setCorreoError(null)
    }
  }

  const handleCorreoElectronicoChange = (e) => {
    const value = e.target.value
    setCorreoElectronico(value)
    setValue('email', value)
    validarCorreoElectronico(value)
  }

  useEffect(() => {
    if (activeAfiliado) {
      const { persona } = activeAfiliado
      const fechaAfiliacion = persona.fecha_afiliacion ? moment(persona.fecha_afiliacion, 'YYYY-MM-DD').toDate() : null
      const fechaNacimiento = persona.fecha_nacimiento ? moment(persona.fecha_nacimiento, 'YYYY-MM-DD').toDate() : null

      // Actualización de los estados individuales
      setLegajo(persona.legajo || '')
      setCuil(persona.cuil || '')
      setDni(persona.dni || '')
      setCorreoElectronico(persona.email || '')
      setTelefono(persona.telefono || '')

      // Actualización de los pickers de fecha
      setPicker(fechaAfiliacion ? [fechaAfiliacion] : [])
      setPicker2(fechaNacimiento ? [fechaNacimiento] : [])

      // Actualización del estado formData
      setFormData({
        sexo_id: persona.sexo_id || null,
        estado_civil_id: persona.estado_civil_id || null,
        nacionalidad_id: persona.nacionalidad_id || null
      })

      // Actualización de todos los valores con setValue
      for (const key in persona) {
        setValue(key, persona[key])
      }
    }
  }, [activeAfiliado, setValue])

  useEffect(() => {
    const personaData = {
      legajo,
      fecha_afiliacion: picker ? moment(picker[0]).format('YYYY-MM-DD') : null,
      nombre: watch('nombre'),
      apellido: watch('apellido'),
      sexo_id: parseInt(watch('sexo_id')) || null,
      fecha_nacimiento: picker2 ? moment(picker2[0]).format('YYYY-MM-DD') : null,
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
  }, [picker, picker2, legajo, dni, cuil, correoElectronico, telefono, watch, dispatch, user.id])

  useEffect(() => {
    if (estadoCivil.length && nacionalidad.length && sexo.length && legajos.length) {
      setIsLoading(false)
    }
  }, [estadoCivil, nacionalidad, sexo, legajos])

  useEffect(() => {
    if (activeAfiliado) {
      const intervals = [2000, 6000]
      const timers = intervals.map((interval) =>
        setTimeout(() => {
          setReloadKey((prevKey) => prevKey + 1)
        }, interval)
      )

      return () => timers.forEach(clearTimeout)
    }
  }, [activeAfiliado])

  return (
    <div key={reloadKey}>
      {isLoadingParent
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
                    error={errors.legajo || legajoError}
                  />
                  {legajoError && <span className='text-red-500'>{legajoError}</span>}
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
                    onChange={handleChange(setCorreoElectronico)}
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
                    onChange={handleChange(setCorreoElectronico)}
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
                    error={errors.dni || dniError}
                    onChange={handleDniChange}
                  />
                  {dniError && <span className='text-red-500'>{dniError}</span>}
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
                  className='minuscula'
                  type='text'
                  id='email'
                  name='email'
                  placeholder='Ingrese el correo electrónico'
                  value={correoElectronico}
                  onChange={handleCorreoElectronicoChange}
                  error={correoError}
                />
                {correoError && <span className='text-red-500'>{correoError}</span>}

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
    </div>
  )
}

export default DatosPersonalesData
