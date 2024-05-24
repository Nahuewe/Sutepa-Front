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
  { id: 'ADMINISTRATIVO', nombre: 'ADMINISTRATIVO' },
  { id: 'CONTRATADO', nombre: 'CONTRATADO' },
  { id: 'PROFESIONAL', nombre: 'PROFESIONAL' },
  { id: 'SERVICIOS_GENERALES', nombre: 'SERVICIOS GENERALES' },
  { id: 'TECNICO', nombre: 'TECNICO' }
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

function InformacionLaboralData ({ register, setValue, disabled }) {
  const [picker, setPicker] = useState(null)
  const [cargaHoraria, setCargaHoraria] = useState('')
  const [correoElectronicoLaboral, setCorreoElectronicoLaboral] = useState('')
  const [telefonoLaboral, setTelefonoLaboral] = useState('')

  useEffect(() => {
    register('fecha_ingreso')
    register('carga_horaria')
    register('email_laboral')
    register('telefono_laboral')
  }, [register])

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

  const handleTelefonoLaboralChange = (e) => {
    const value = e.target.value
    setTelefonoLaboral(value)
    setValue('telefono_laboral', value)
  }

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
            options={agrupamiento}
            disabled={disabled}
          />

          <SelectForm
            register={register('agencia_id')}
            title='Agencia'
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
            register={register('seccional_id')}
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
              name='carga_horaria'
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
            id='email_laboral'
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
          />
        </div>
      </Card>
    </>
  )
}

export default InformacionLaboralData
