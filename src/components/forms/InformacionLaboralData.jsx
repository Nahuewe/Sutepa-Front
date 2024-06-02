import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { sutepaApi } from '../../api'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Numberinput from '@/components/ui/Numberinput'
import { SelectForm } from '@/components/sutepa/forms'
import DatePicker from '../ui/DatePicker'
import { updateDatosLaborales } from '../../store/ingreso'

const tipoContrato = [
  { id: 'PLANTA PERMANENTE', nombre: 'PLANTA PERMANENTE' },
  { id: 'CONTRATO', nombre: 'CONTRATO' }
]

const tramo = [
  { id: 'A', nombre: 'A' }, // Equivale a 45Hs
  { id: 'B', nombre: 'B' }, // Equivale a 40Hs
  { id: 'C', nombre: 'C' }, // Equivale a 35Hs
  { id: 'D', nombre: 'D' } // Equivale a 35Hs
]

const tramoHoras = {
  A: 45,
  B: 40,
  C: 35,
  D: 35
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
  const [filteredAgencias, setFilteredAgencias] = useState([])
  const [agenciaDisabled, setAgenciaDisabled] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agrupamientoResponse, seccionalResponse, uglResponse] = await Promise.all([
          sutepaApi.get('agrupamiento'),
          sutepaApi.get('seccional'),
          sutepaApi.get('ugl')
        ])
        setAgrupamiento(agrupamientoResponse.data.data)
        setSeccional(seccionalResponse.data.data)
        setUgl(uglResponse.data.data)
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
    setValue('email', value)
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
    console.log('Agencia Data:', data)
    setFilteredAgencias(data)
    setAgenciaDisabled(false)
  }

  const handleAgenciaChange = async (e) => {
    const agenciaId = e.target.value
    if (agenciaId) {
      const response = await sutepaApi.get(`agencia/${agenciaId}`)
      const { data } = response.data
      if (data && data.length > 0) {
        const domicilio = data[0].domicilio_trabajo || ''
        const telefono = data[0].telefono_laboral || ''
        setValue('domicilio_trabajo', domicilio)
        setValue('telefono_laboral', telefono)
        setDomicilioTrabajo(domicilio)
        setTelefonoLaboral(telefono)
      } else {
        setValue('domicilio_trabajo', '')
        setValue('telefono_laboral', '')
        setDomicilioTrabajo('')
        setTelefonoLaboral('')
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

  useEffect(() => {
    dispatch(updateDatosLaborales({
      tipo_contrato: watch('tipo_contrato'),
      ugl_id: parseInt(watch('ugl_id')),
      agencia_id: parseInt(watch('agencia_id')),
      domicilio_trabajo: watch('domicilio_trabajo'),
      seccional_id: parseInt(watch('seccional_id')),
      agrupamiento_id: parseInt(watch('agrupamiento_id')),
      tramo: watch('tramo'),
      carga_horaria: watch('carga_horaria'),
      fecha_ingreso: picker ? picker[0] : null,
      email: watch('email'),
      telefono_laboral: watch('telefono_laboral')
    }))
  }, [
    watch('tipo_contrato'),
    watch('ugl_id'),
    watch('agencia_id'),
    watch('domicilio_trabajo'),
    watch('seccional_id'),
    watch('agrupamiento_id'),
    watch('tramo'),
    watch('carga_horaria'),
    picker,
    watch('email'),
    watch('telefono_laboral')
  ])

  return (
    <>
      <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
        Información Laboral
      </h4>

      <Card>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <SelectForm
            register={register('tipo_contrato')}
            title='Tipo de Contrato'
            options={tipoContrato}
            disabled={disabled}
          />

          <SelectForm
            register={register('ugl_id')}
            title='UGL'
            options={ugl}
            onChange={handleUglChange}
            disabled={disabled}
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
              disabled={disabled}
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
            disabled={disabled}
          />

          <SelectForm
            register={register('agrupamiento_id')}
            title='Agrupamiento'
            options={agrupamiento}
            disabled={disabled}
          />

          <SelectForm
            register={register('tramo')}
            title='Tramo'
            options={tramo}
            onChange={handleTramoChange}
            disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
            />
          </div>

          <div>
            <Textinput
              label='Correo Electrónico Laboral'
              name='email'
              register={register}
              className='minuscula'
              placeholder='Ingrese el correo electrónico laboral'
              disabled={disabled}
              value={correoElectronicoLaboral}
              onChange={handleCorreoElectronicoChange}
            />
          </div>

          <div>
            <Textinput
              label='Teléfono de Trabajo'
              name='telefono_laboral'
              register={register}
              placeholder='Ingrese el teléfono laboral'
              disabled={disabled}
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
