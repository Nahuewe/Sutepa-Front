import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Numberinput from '@/components/ui/Numberinput'
import { SelectForm } from '@/components/giro/forms'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_red.css'
import { useState, useEffect } from 'react'

const sexo = [
  {
    id: 'PLANTA PERMANENTE',
    nombre: 'PLANTA PERMANENTE'
  },
  {
    id: 'CONTRATO',
    nombre: 'CONTRATO'
  }
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

function InformacionLaboralData ({ register, setValue, errors }) {
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
            options={sexo}
          />

          <SelectForm
            register={register('ugl')}
            title='UGL'
            options={sexo}
          />

          <SelectForm
            register={register('lugarTrabajo')}
            title='Lugar de Trabajo'
            options={sexo}
          />

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Domicilio de Trabajo
            </label>
            <Textinput
              name='domicilioTrabajo'
              type='text'
              register={register}
              placeholder='Domicilio de Trabajo'
            />
          </div>

          <SelectForm
            register={register('seccional')}
            title='Seccional SUTEPA'
            options={sexo}
          />

          <SelectForm
            register={register('agrupamiento')}
            title='Agrupamiento'
            options={sexo}
          />

          <SelectForm
            register={register('tramo')}
            title='Tramo'
            options={sexo}
          />

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Carga Horaria
            </label>
            <Numberinput
              name='cargaHoraria'
              register={register}
              placeholder='Carga horaria'
              value={cargaHoraria}
              onChange={handleCargaHorarioChange}
            />
          </div>

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Fecha de Ingreso
            </label>

            <Flatpickr
              options={flatpickrOptions}
              className='form-control py-2 flatPickrBG dark:flatPickrBGDark'
              value={picker}
              id='fechaIngreso'
              placeholder='Fecha de Ingreso'
              onChange={handleDateChange}
            />
            <input type='hidden' {...register('fechaIngreso')} />
          </div>

          <Textinput
            label='Correo Electrónico Laboral'
            register={register}
            id='correoElectronicoLaboral'
            placeholder='Correo Electrónico Laboral'
            value={correoElectronicoLaboral}
            onChange={handleCorreoElectronicoChange}
            error={errors.correoElectronicoLaboral}
          />

          <Numberinput
            label='Teléfono Laboral'
            register={register}
            id='telefonoLaboral'
            placeholder='Teléfono Laboral'
            value={telefonoLaboral}
            onChange={handleTelefonoLaboralChange}
            error={errors.telefonoLaboral}
          />
        </div>
      </Card>
    </>
  )
}

export default InformacionLaboralData
