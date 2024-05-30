import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Numberinput from '@/components/ui/Numberinput'
import { SelectForm } from '@/components/sutepa/forms'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_red.css'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateDatosLaborales } from '../../store/ingreso'
import { sutepaApi } from '../../api'

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

const flatpickrOptions = {
  dateFormat: 'd-m-Y',
  locale: {
    firstDayOfWeek: 1,
    weekdays: {
      shorthand: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
      longhand: [
        'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
      ]
    },
    months: {
      shorthand: [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
      ],
      longhand: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]
    }
  }
}

function InformacionLaboralData ({ register, setValue, disabled, watch }) {
  const [picker, setPicker] = useState(null)
  const [cargaHoraria, setCargaHoraria] = useState('')
  const [correoElectronicoLaboral, setCorreoElectronicoLaboral] = useState('')
  const [telefonoLaboral, setTelefonoLaboral] = useState('')
  const dispatch = useDispatch()
  const [agrupamiento, setAgrupamiento] = useState([])
  const [seccional, setSeccional] = useState([])
  const [ugl, setUgl] = useState([])
  const [agencia, setAgencia] = useState([])

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

  async function handleAgencia () {
    const response = await sutepaApi.get('agencia')
    const { data } = response.data
    setAgencia(data)
  }

  useEffect(() => {
    const datosLaboralesData = {
      fecha_afiliacion: picker,
      carga_horaria: cargaHoraria,
      email: correoElectronicoLaboral,
      telefono_laboral: telefonoLaboral,
      tipo_contrato: watch('tipo_contrato'),
      ugl_id: watch('ugl_id'),
      agencia_id: watch('agencia_id'),
      domicilio_trabajo: watch('domicilio_trabajo'),
      seccional_id: watch('seccional_id'),
      agrupamiento: watch('agrupamiento'),
      tramo: watch('tramo')
    }

    dispatch(updateDatosLaborales(datosLaboralesData))
  }, [picker, correoElectronicoLaboral, telefonoLaboral, dispatch])

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

  const handleTelefonoLaboralChange = (e) => {
    const value = e.target.value
    setTelefonoLaboral(value)
    setValue('telefono_laboral', value)
  }

  const handleTramoChange = (e) => {
    const selectedTramo = e.target.value
    const horas = tramoHoras[selectedTramo] || ''
    setCargaHoraria(horas)
    setValue('carga_horaria', horas)
  }

  useEffect(() => {
    handleAgrupamiento()
    handleSeccional()
    handleUgl()
    handleAgencia()
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
            disabled={disabled}
          />

          <SelectForm
            register={register('agencia_id')}
            title='Agencia'
            options={agencia}
            disabled={disabled}
          />

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Domicilio de Trabajo
            </label>
            <Textinput
              name='domicilio_trabajo'
              type='text'
              register={register}
              placeholder='Ingrese el domicilio de trabajo'
              disabled={disabled}
              readonly
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
            <label htmlFor='default-picker' className='form-label'>
              Fecha de Ingreso
            </label>

            <Flatpickr
              options={flatpickrOptions}
              className='form-control py-2 flatPickrBG dark:flatPickrBGDark dark:placeholder-white placeholder-black-500'
              value={picker}
              id='fecha_ingreso'
              placeholder='Ingese la fecha de ingreso'
              onChange={handleDateChange}
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

          <Numberinput
            label='Teléfono Laboral'
            register={register}
            id='telefono_laboral'
            placeholder='Ingrese el teléfono laboral'
            value={telefonoLaboral}
            onChange={handleTelefonoLaboralChange}
            disabled={disabled}
            readOnly
          />
        </div>
      </Card>
    </>
  )
}

export default InformacionLaboralData
