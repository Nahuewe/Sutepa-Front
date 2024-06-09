import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Numberinput from '@/components/ui/Numberinput'
import { SelectForm } from '@/components/sutepa/forms'
import { updatePersona } from '../../store/afiliado'
import { sutepaApi } from '../../api'
import DatePicker from '../ui/DatePicker'
import moment from 'moment/moment'

const tipoDocumento = [
  { id: 'DNI', nombre: 'DNI' },
  { id: 'PASAPORTE', nombre: 'PASAPORTE' }
]

const initialForm = {
  sexo_id: null,
  estado_civil_id: null,
  nacionalidad_id: null,
  estados_id: 1
}

function DatosPersonalesData ({ register, setValue, errors, disabled, watch }) {
  const [picker, setPicker] = useState(null)
  const [picker2, setPicker2] = useState(null)
  const [cuil, setCuil] = useState('')
  const [dni, setDni] = useState('')
  const [legajo, setLegajo] = useState('')
  const [correoElectronico, setCorreoElectronico] = useState('')
  const [formData, setFormData] = useState(initialForm)
  const [telefono, setTelefono] = useState('')
  const dispatch = useDispatch()
  const [estadoCivil, setEstadoCivil] = useState([])
  const [nacionalidad, setNacionalidad] = useState([])
  const [sexo, setSexo] = useState([])

  const { activeAfiliado } = useSelector(state => state.afiliado)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [estadoCivilResponse, nacionalidadResponse, sexoResponse] = await Promise.all([
          sutepaApi.get('estadocivil'),
          sutepaApi.get('nacionalidad'),
          sutepaApi.get('sexo')
        ])
        setEstadoCivil(estadoCivilResponse.data.data)
        setNacionalidad(nacionalidadResponse.data.data)
        setSexo(sexoResponse.data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (activeAfiliado) {
      setValue('legajo', activeAfiliado.legajo)
      setValue('fecha_afiliacion', activeAfiliado.fecha_afiliacion ? moment(activeAfiliado.fecha_afiliacion).toDate() : null)
      setValue('nombre', activeAfiliado.nombre)
      setValue('apellido', activeAfiliado.apellido)
      setValue('sexo_id', activeAfiliado.sexo_id)
      setValue('fecha_nacimiento', activeAfiliado.fecha_nacimiento ? moment(activeAfiliado.fecha_nacimiento).toDate() : null)
      setValue('estado_civil_id', activeAfiliado.estado_civil_id)
      setValue('tipo_documento', activeAfiliado.tipo_documento)
      setValue('dni', activeAfiliado.dni)
      setValue('cuil', activeAfiliado.cuil)
      setValue('email', activeAfiliado.email)
      setValue('telefono', activeAfiliado.telefono)
      setValue('nacionalidad_id', activeAfiliado.nacionalidad_id)

      setLegajo(activeAfiliado.legajo || '')
      setPicker(activeAfiliado.fecha_afiliacion ? [moment(activeAfiliado.fecha_afiliacion).toDate()] : null)
      setPicker2(activeAfiliado.fecha_nacimiento ? [moment(activeAfiliado.fecha_nacimiento).toDate()] : null)
      setDni(activeAfiliado.dni || '')
      setCuil(activeAfiliado.cuil || '')
      setCorreoElectronico(activeAfiliado.email || '')
      setTelefono(activeAfiliado.telefono || '')
    }
  }, [activeAfiliado, setValue])

  // Función para manejar el envío de datos al store de Redux
  const handleUpdatePersona = () => {
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
      email: correoElectronico || null,
      telefono,
      nacionalidad_id: parseInt(watch('nacionalidad_id')) || null,
      estados_id: 1
    }
    dispatch(updatePersona(personaData))
  }

  useEffect(() => {
    handleUpdatePersona()
  }, [picker, picker2, legajo, dni, cuil, correoElectronico, telefono, watch('nombre'), watch('apellido'), watch('sexo_id'), watch('estado_civil_id'), watch('tipo_documento'), watch('nacionalidad_id')])

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

    // Limitar la longitud a 5 caracteres
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
  }

  return (
    <>
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
              disabled={disabled}
            />
          </div>

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Fecha de Afiliación
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
            register={register('sexo_id')}
            title='Sexo'
            options={sexo}
            disabled={disabled}
            onChange={handleChange}
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

          <SelectForm
            register={register('estado_civil_id')}
            title='Estado Civil'
            options={estadoCivil}
            disabled={disabled}
            onChange={(e) => handleSelectChange('estado_civil_id', e)}
          />

          <SelectForm
            register={register('nacionalidad_id')}
            title='Nacionalidad'
            options={nacionalidad}
            disabled={disabled}
            onChange={(e) => handleSelectChange('nacionalidad_id', e)}
          />

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
              error={errors.dni}
              onChange={handleDniChange}
              disabled={disabled}
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
              disabled={disabled}
            />
          </div>

          <Textinput
            label='Correo Electrónico'
            register={register}
            id='email'
            type='email'
            placeholder='Ingrese el correo electrónico'
            value={correoElectronico}
            onChange={handleChange(setCorreoElectronico)}
            disabled={disabled}
          />

          <Numberinput
            label='Teléfono'
            register={register}
            id='telefono'
            type='number'
            placeholder='Ingrese el número de teléfono'
            value={telefono}
            onChange={handleChange(setTelefono)}
            disabled={disabled}
          />
        </div>
      </Card>
    </>
  )
}

export default DatosPersonalesData
