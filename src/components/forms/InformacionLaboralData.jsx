import React, { useState, useEffect } from 'react'
import { sutepaApi } from '../../api'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Numberinput from '@/components/ui/Numberinput'
import { SelectForm } from '@/components/sutepa/forms'
import DatePicker from '../ui/DatePicker'
import { onAddAgencia } from '../../store/ingreso'
import { useDispatch } from 'react-redux'

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

function InformacionLaboralData ({ register, setValue, disabled }) {
  const [picker, setPicker] = useState(null)
  const [cargaHoraria, setCargaHoraria] = useState('')
  const dispatch = useDispatch()
  const [correoElectronicoLaboral, setCorreoElectronicoLaboral] = useState('')
  const [telefonoLaboral, setTelefonoLaboral] = useState('')
  const [domicilioTrabajo, setDomicilioTrabajo] = useState('')
  const [agrupamiento, setAgrupamiento] = useState([])
  const [seccional, setSeccional] = useState([])
  const [ugl, setUgl] = useState([])
  const [filteredAgencias, setFilteredAgencias] = useState([])
  const [agenciaDisabled, setAgenciaDisabled] = useState(true)

  function addItem (agencia) {
    setDomicilioTrabajo(agencia.domicilio_trabajo)
    setTelefonoLaboral(agencia.telefono_laboral)
    setValue('domicilio_trabajo', agencia.domicilio_trabajo)
    setValue('telefono_laboral', agencia.telefono_laboral)
    dispatch(onAddAgencia(agencia))
  }

  async function handleAgrupamiento () {
    const response = await sutepaApi.get('agrupamiento')
    const { data } = response.data
    setAgrupamiento(data)
  }

  async function handleSeccional () {
    const response = await sutepaApi.get('seccional')
    const { data } = response.data
    setSeccional(data)
  }

  async function handleUgl () {
    const response = await sutepaApi.get('ugl')
    const { data } = response.data
    setUgl(data)
  }

  async function handleAgencia (id) {
    const response = await sutepaApi.get(`agencia/${id}`)
    const { data } = response.data
    setFilteredAgencias(data)
    setAgenciaDisabled(false)
    console.log(data)
  }

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

  // const handleTelefonoLaboralChange = (e) => {
  //   const value = e.target.value
  //   setTelefonoLaboral(value)
  //   setValue('telefono_laboral', value)
  // }

  const handleTramoChange = (e) => {
    const selectedTramo = e.target.value
    const horas = tramoHoras[selectedTramo] || ''
    setCargaHoraria(horas)
    setValue('carga_horaria', horas)
  }

  const handleAgenciaChange = async (e) => {
    const agenciaId = e.target.value
    if (agenciaId) {
      try {
        const response = await sutepaApi.get(`agencia/${agenciaId}`)
        const { data } = response.data
        if (data) {
          const domicilio = data.domicilio_trabajo || ''
          const telefono = data.telefono_laboral || ''
          setValue('domicilio_trabajo', domicilio)
          setValue('telefono_laboral', telefono)
          setDomicilioTrabajo(domicilio)
          setTelefonoLaboral(telefono)
          addItem(data)
        }
      } catch (error) {
        console.error('Error fetching agency data:', error)
      }
    }
  }

  const handleUglChange = (e) => {
    const selectedUglId = e.target.value
    handleAgencia(selectedUglId)
    setValue('agencia_id', '')
    setAgenciaDisabled(true)
  }

  useEffect(() => {
    handleAgrupamiento()
    handleSeccional()
    handleUgl()
  }, [])

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
              onChange={(e) => setDomicilioTrabajo(e.target.value)}
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
              disabled={disabled}
            />
            <input type='hidden' {...register('fecha_ingreso')} />
          </div>

          <Textinput
            label='Correo Electrónico Laboral'
            register={register}
            id='email'
            className='minuscula'
            placeholder='Ingrese el correo electrónico laboral'
            value={correoElectronicoLaboral}
            onChange={handleCorreoElectronicoChange}
            disabled={disabled}
          />

          <Textinput
            label='Teléfono Laboral'
            register={register}
            id='telefono_laboral'
            placeholder='Ingrese el teléfono laboral'
            value={telefonoLaboral}
            // onChange={handleTelefonoLaboralChange}
            onChange={(e) => setTelefonoLaboral(e.target.value)}
            disabled={disabled}
          />
        </div>
      </Card>
    </>
  )
}

export default InformacionLaboralData
