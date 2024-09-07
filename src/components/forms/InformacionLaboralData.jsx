/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sutepaApi } from '@/api'
import { updateDatosLaborales } from '@/store/afiliado'
import { SelectForm } from '@/components/sutepa/forms'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Numberinput from '@/components/ui/Numberinput'
import DatePicker from '../ui/DatePicker'
import moment from 'moment'
import useFetchData from '@/helpers/useFetchData'
import Loading from '@/components/Loading'

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
  const [filteredAgencias, setFilteredAgencias] = useState([])
  const [agenciaDisabled, setAgenciaDisabled] = useState(true)
  const { agrupamiento, seccional, ugl, tramo } = useFetchData()
  const dispatch = useDispatch()
  const { activeAfiliado } = useSelector(state => state.afiliado)
  const [isLoading, setIsLoading] = useState(true)

  const handleDateChange = (date) => {
    setPicker(date)
    setValue('fecha_ingreso', date[0])
  }

  const handleInputChange = (field, value) => {
    setValue(field, value)
    handleDatosLaboralesUpdate()
  }

  const handleCargaHorarioChange = (e) => {
    const value = e.target.value
    setCargaHoraria(value)
    handleInputChange('carga_horaria', value)
  }

  const handleCorreoElectronicoChange = (e) => {
    const value = e.target.value
    setCorreoElectronicoLaboral(value)
    handleInputChange('email_laboral', value)
  }

  const handleTramoChange = (e) => {
    const selectedTramo = e.target.value
    const horas = tramoHoras[selectedTramo] || ''
    setCargaHoraria(horas)
    handleInputChange('carga_horaria', horas)
  }

  async function handleAgencia (ugl_id) {
    try {
      const response = await sutepaApi.get(`agencia?ugl_id=${ugl_id}`)
      const { data } = response.data
      setFilteredAgencias(data)
      setAgenciaDisabled(false)
    } catch (error) {
      console.error('Error fetching agencies:', error)
    }
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
          handleInputChange('domicilio_trabajo', domicilio_trabajo)
          handleInputChange('telefono_laboral', telefono_laboral)
        } else {
          setDomicilioTrabajo('')
          setTelefonoLaboral('')
          handleInputChange('domicilio_trabajo', '')
          handleInputChange('telefono_laboral', '')
        }
        handleInputChange('agencia_id', agenciaId)
      } catch (error) {
        console.error('Error fetching agency data:', error)
      }
    }
  }

  const handleUglChange = (e) => {
    const selectedUglId = e.target.value
    if (selectedUglId) {
      handleAgencia(selectedUglId)
      handleInputChange('agencia_id', '')
      setAgenciaDisabled(true)
    }
    handleInputChange('ugl_id', selectedUglId)
  }

  const handleDatosLaboralesUpdate = () => {
    const datosLaborales = {
      tipo_contrato_id: parseInt(watch('tipo_contrato_id')) || 1,
      ugl_id: parseInt(watch('ugl_id')) || null,
      agencia_id: parseInt(watch('agencia_id')) || null,
      domicilio_trabajo: watch('domicilio_trabajo') || null,
      seccional_id: parseInt(watch('seccional_id')) || null,
      agrupamiento_id: parseInt(watch('agrupamiento_id')) || 1,
      tramo_id: parseInt(watch('tramo_id')) || 1,
      carga_horaria: watch('carga_horaria') || null,
      fecha_ingreso: picker ? moment(picker[0]).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD'),
      email_laboral: watch('email_laboral') || null,
      telefono_laboral: watch('telefono_laboral') || null
    }
    dispatch(updateDatosLaborales(datosLaborales))
  }

  useEffect(() => {
    handleDatosLaboralesUpdate()
  }, [picker, cargaHoraria, correoElectronicoLaboral, telefonoLaboral, domicilioTrabajo, watch])

  useEffect(() => {
    if (activeAfiliado?.datos_laborales) {
      const {
        tipo_contrato_id,
        ugl_id,
        agencia_id,
        domicilio,
        seccional_id,
        agrupamiento_id,
        tramo_id,
        carga_horaria,
        fecha_ingreso,
        email_laboral,
        telefono_laboral
      } = activeAfiliado.datos_laborales

      setValue('tipo_contrato_id', tipo_contrato_id)
      setValue('ugl_id', ugl_id)
      setValue('agencia_id', agencia_id)
      setValue('domicilio_trabajo', domicilio)
      setValue('seccional_id', seccional_id)
      setValue('agrupamiento_id', agrupamiento_id)
      setValue('tramo_id', tramo_id)
      setValue('carga_horaria', carga_horaria)
      setValue('fecha_ingreso', fecha_ingreso)
      setValue('email_laboral', email_laboral)
      setValue('telefono_laboral', telefono_laboral)

      setDomicilioTrabajo(domicilio)
      setTelefonoLaboral(telefono_laboral)
      setCargaHoraria(carga_horaria)
      setCorreoElectronicoLaboral(email_laboral)
      setPicker([moment(fecha_ingreso).toDate()])
      handleAgencia(ugl_id)
    }
  }, [activeAfiliado, setValue])

  useEffect(() => {
    if (agrupamiento.length && seccional.length && ugl.length && tramo.length) {
      setIsLoading(false)
    }
  }, [agrupamiento, seccional, ugl, tramo])

  return (
    <>
      {isLoading
        ? (
          <Loading className='mt-28 md:mt-64' />
          )
        : (
          <div>
            <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
              Información Laboral
            </h4>

            <Card>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <SelectForm
                  register={register('tipo_contrato_id')}
                  title='Tipo de Contrato'
                  options={tipoContrato}
                  onChange={(e) => handleInputChange('tipo_contrato_id', e.target.value)}
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
                      handleInputChange('domicilio_trabajo', e.target.value)
                    }}
                  />
                </div>

                <SelectForm
                  register={register('seccional_id')}
                  title='Seccional SUTEPA'
                  options={seccional}
                  onChange={(e) => handleInputChange('seccional_id', e.target.value)}
                />

                <SelectForm
                  register={register('agrupamiento_id')}
                  title='Agrupamiento'
                  options={agrupamiento}
                  onChange={(e) => handleInputChange('agrupamiento_id', e.target.value)}
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
                  <Textinput
                    label='Correo Electrónico Laboral'
                    name='email_laboral'
                    className='minuscula'
                    type='text'
                    register={register}
                    placeholder='Ingrese el correo electrónico laboral'
                    value={correoElectronicoLaboral}
                    onChange={handleCorreoElectronicoChange}
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
                    label='Teléfono de Trabajo'
                    name='telefono_laboral'
                    register={register}
                    placeholder='Ingrese el teléfono de trabajo'
                    disabled
                    value={telefonoLaboral}
                    onChange={(e) => {
                      setTelefonoLaboral(e.target.value)
                      handleInputChange('telefono_laboral', e.target.value)
                    }}
                  />
                </div>
              </div>
            </Card>
          </div>
          )}
    </>
  )
}

export default InformacionLaboralData
