import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Numberinput from '@/components/ui/Numberinput'
import { SelectForm } from '@/components/sutepa/forms'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_red.css'
import { useState, useEffect } from 'react'

const tipoContrato = [
  {
    id: 'PLANTA PERMANENTE',
    nombre: 'PLANTA PERMANENTE'
  },
  {
    id: 'CONTRATO',
    nombre: 'CONTRATO'
  }
]

const agrupamiento = [
  { id: 'ADMINISTRATIVO', nombre: 'Administrativo' },
  { id: 'CONTRATADO', nombre: 'Contratado' },
  { id: 'PROFESIONAL', nombre: 'Profesional' },
  { id: 'SERVICIOS_GENERALES', nombre: 'Servicios Generales' },
  { id: 'TECNICO', nombre: 'Tecnico' }
]

const tramo = [
  { id: 'A', nombre: 'A' },
  { id: 'B', nombre: 'B' },
  { id: 'C', nombre: 'C' },
  { id: 'D', nombre: 'D' }
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

function InformacionLaboralData ({ register, setValue, errors, disabled }) {
  const [picker, setPicker] = useState(null)
  const [cargaHoraria, setCargaHoraria] = useState('')
  const [correoElectronicoLaboral, setCorreoElectronicoLaboral] = useState('')
  const [telefonoLaboral, setTelefonoLaboral] = useState('')

  useEffect(() => {
    register('fechaIngreso')
    register('cargaHoraria')
    register('correoElectronicoLaboral')
    register('telefonoLaboral')
  }, [register])

  const handleDateChange = (date) => {
    setPicker(date)
    setValue('fechaIngreso', date[0])
  }

  const handleCargaHorarioChange = (e) => {
    const value = e.target.value
    setCargaHoraria(value)
    setValue('cargaHoraria', value)
  }

  const handleCorreoElectronicoChange = (e) => {
    const value = e.target.value
    setCorreoElectronicoLaboral(value)
    setValue('correoElectronicoLaboral', value)
  }

  const handleTelefonoLaboralChange = (e) => {
    const value = e.target.value
    setTelefonoLaboral(value)
    setValue('telefonoLaboral', value)
  }

  return (
    <>
      <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
        Información Laboral
      </h4>

      <Card>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <SelectForm
            register={register('tipoContrato')}
            title='Tipo de Contrato'
            options={tipoContrato}
            disabled={disabled}
          />

          <SelectForm
            register={register('ugl')}
            title='UGL'
            options={agrupamiento}
            disabled={disabled}
          />

          <SelectForm
            register={register('lugarTrabajo')}
            title='Lugar de Trabajo'
            options={agrupamiento}
            disabled={disabled}
          />

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Domicilio de Trabajo
            </label>
            <Textinput
              name='domicilioTrabajo'
              type='text'
              register={register}
              placeholder='Ingrese el domicilio de trabajo'
              disabled={disabled}
            />
          </div>

          <SelectForm
            register={register('seccional')}
            title='Seccional SUTEPA'
            options={agrupamiento}
            disabled={disabled}
          />

          <SelectForm
            register={register('agrupamiento')}
            title='Agrupamiento'
            options={agrupamiento}
            disabled={disabled}
          />

          <SelectForm
            register={register('tramo')}
            title='Tramo'
            options={tramo}
            disabled={disabled}
          />

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Carga Horaria
            </label>
            <Numberinput
              name='cargaHoraria'
              register={register}
              placeholder='Ingrese la carga horaria'
              value={cargaHoraria}
              onChange={handleCargaHorarioChange}
              disabled={disabled}
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
              id='fechaIngreso'
              placeholder='Ingese la fecha de ingreso'
              onChange={handleDateChange}
              disabled={disabled}
            />
            <input type='hidden' {...register('fechaIngreso')} />
          </div>

          <Textinput
            label='Correo Electrónico Laboral'
            register={register}
            id='correoElectronicoLaboral'
            placeholder='Ingrese el correo electrónico laboral'
            value={correoElectronicoLaboral}
            onChange={handleCorreoElectronicoChange}
            error={errors.correoElectronicoLaboral}
            disabled={disabled}
          />

          <Numberinput
            label='Teléfono Laboral'
            register={register}
            id='telefonoLaboral'
            placeholder='Ingrese el teléfono laboral'
            value={telefonoLaboral}
            onChange={handleTelefonoLaboralChange}
            error={errors.telefonoLaboral}
            disabled={disabled}
          />
        </div>
      </Card>
    </>
  )
}

export default InformacionLaboralData
