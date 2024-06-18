/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { sutepaApi } from '../../api'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Numberinput from '@/components/ui/Numberinput'
import { SelectForm } from '@/components/sutepa/forms'
import DatePicker from '../ui/DatePicker'
import { updateDatosLaborales } from '../../store/afiliado'
import moment from 'moment'

const tipoContrato = [
  { id: 1, nombre: 'PLANTA PERMANENTE' },
  { id: 2, nombre: 'CONTRATO' }
]

const tramoHoras = {
  1: '45',
  2: '40',
  3: '35',
  4: '35'
}

function InformacionLaboralData ({ register, setValue, watch, disabled }) {
  const [picker, setPicker] = useState(null)
  const [cargaHoraria, setCargaHoraria] = useState('')
  const [correoElectronicoLaboral, setCorreoElectronicoLaboral] = useState('')
  const [telefonoLaboral, setTelefonoLaboral] = useState('')
  const [domicilioTrabajo, setDomicilioTrabajo] = useState('')
  const [agrupamiento, setAgrupamiento] = useState([])
  const [seccional, setSeccional] = useState([])
  const [ugl, setUgl] = useState([])
  const [tramo, setTramo] = useState([])
  const [filteredAgencias, setFilteredAgencias] = useState([])
  const [agenciaDisabled, setAgenciaDisabled] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agrupamientoResponse, seccionalResponse, uglResponse, tramoResponse] = await Promise.all([
          sutepaApi.get('agrupamiento'),
          sutepaApi.get('seccional'),
          sutepaApi.get('ugl'),
          sutepaApi.get('tramo')
        ])
        setAgrupamiento(agrupamientoResponse.data.data)
        setSeccional(seccionalResponse.data.data)
        setUgl(uglResponse.data.data)
        setTramo(tramoResponse.data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const handleDateChange = (date) => {
    setPicker(date)
    setValue('fecha_ingreso', date[0])
  }

  const handleCargaHorarioChange = (e) => {
    const value = e.target.value
    setCargaHoraria(value)
    setValue('carga_horaria', value)
  }

  const handleCorreoElectronicoChange = (e) => {
    const value = e.target.value
    setCorreoElectronicoLaboral(value)
    setValue('email_laboral', value)
  }

  const handleTramoChange = (e) => {
    const selectedTramo = e.target.value
    const horas = tramoHoras[selectedTramo] || ''
    setCargaHoraria(horas)
    setValue('carga_horaria', horas)
  }

  async function handleAgencia (id) {
    const response = await sutepaApi.get(`agencia/${id}`)
    const { data } = response.data
    setFilteredAgencias(data)
    setAgenciaDisabled(false)
  }

  const handleAgenciaChange = async (e) => {
    const agenciaId = e.target.value
    if (agenciaId) {
      try {
        const response = await sutepaApi.get(`agenciaDatos/${agenciaId}`)
        const { data } = response.data
        if (data) {
          const { domicilio_trabajo, telefono_laboral } = data
          setDomicilioTrabajo(domicilio_trabajo)
          setTelefonoLaboral(telefono_laboral)
          setValue('domicilio_trabajo', domicilio_trabajo)
          setValue('telefono_laboral', telefono_laboral)
        } else {
          setDomicilioTrabajo('')
          setTelefonoLaboral('')
          setValue('domicilio_trabajo', '')
          setValue('telefono_laboral', '')
        }
      } catch (error) {
        console.error('Error fetching agency data:', error)
      }
    }
  }

  const handleUglChange = (e) => {
    const selectedUglId = e.target.value
    if (selectedUglId) {
      handleAgencia(selectedUglId)
      setValue('agencia_id', '')
      setAgenciaDisabled(true)
    }
  }

  const filterEmptyValues = (data) => {
    return Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null && v !== ''))
  }

  useEffect(() => {
    const datosLaborales = {
      tipo_contrato_id: parseInt(watch('tipo_contrato_id')) || null,
      ugl_id: parseInt(watch('ugl_id')) || null,
      agencia_id: parseInt(watch('agencia_id')) || null,
      domicilio_trabajo: watch('domicilio_trabajo') || null,
      seccional_id: parseInt(watch('seccional_id')) || null,
      agrupamiento_id: parseInt(watch('agrupamiento_id')) || null,
      tramo_id: parseInt(watch('tramo_id')) || null,
      carga_horaria: watch('carga_horaria') || null,
      fecha_ingreso: picker ? moment(picker[0]).format('YYYY-MM-DD') : null,
      email_laboral: watch('email_laboral') || null,
      telefono_laboral: watch('telefono_laboral') || null
    }
    const filteredDatosLaborales = filterEmptyValues(datosLaborales)
    if (Object.keys(filteredDatosLaborales).length > 0) {
      dispatch(updateDatosLaborales(filteredDatosLaborales))
    }
  }, [watch, picker, dispatch, watch('email_laboral')])

  return (
    <>
      <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
        Información Laboral
      </h4>

      <Card>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <SelectForm
            register={register('tipo_contrato_id')}
            title='Tipo de Contrato'
            options={tipoContrato}
          />

          <SelectForm
            register={register('ugl_id')}
            title='UGL'
            options={ugl}
            onChange={handleUglChange}
          />

          <SelectForm
            register={register('agencia_id')}
            title='Agencia'
            options={filteredAgencias}
            onChange={handleAgenciaChange}
            disabled={disabled || agenciaDisabled}
          />

          <div>
            <Textinput
              label='Domicilio de Trabajo'
              name='domicilio_trabajo'
              register={register}
              placeholder='Ingrese el domicilio de trabajo'
              disabled
              value={domicilioTrabajo}
              onChange={(e) => {
                setDomicilioTrabajo(e.target.value)
                setValue('domicilio_trabajo', e.target.value)
              }}
            />
          </div>

          <SelectForm
            register={register('seccional_id')}
            title='Seccional SUTEPA'
            options={seccional}
          />

          <SelectForm
            register={register('agrupamiento_id')}
            title='Agrupamiento'
            options={agrupamiento}
          />

          <SelectForm
            register={register('tramo_id')}
            title='Tramo'
            options={tramo}
            onChange={handleTramoChange}
          />

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Carga Horaria
            </label>
            <Numberinput
              name='carga_horaria'
              register={register}
              placeholder='Ingrese la carga horaria'
              value={cargaHoraria}
              onChange={handleCargaHorarioChange}
              readOnly
            />
          </div>

          <div>
            <label htmlFor='fecha_ingreso' className='form-label'>
              Fecha de Ingreso
            </label>

            <DatePicker
              value={picker}
              onChange={handleDateChange}
              id='fecha_ingreso'
              placeholder='Ingrese la fecha de ingreso'
              className='form-control'
              clearable
            />
          </div>

          <div>
            <Textinput
              label='Correo Electrónico Laboral'
              name='email_laboral'
              type='email'
              register={register}
              placeholder='Ingrese el correo electrónico laboral'
              value={correoElectronicoLaboral}
              onChange={handleCorreoElectronicoChange}
            />
          </div>

          <div>
            <Textinput
              label='Teléfono de Trabajo'
              name='telefono_laboral'
              register={register}
              placeholder='Ingrese el teléfono de trabajo'
              disabled
              value={telefonoLaboral}
              onChange={(e) => {
                setTelefonoLaboral(e.target.value)
                setValue('telefono_laboral', e.target.value)
              }}
            />
          </div>
        </div>
      </Card>
    </>
  )
}

export default InformacionLaboralData
