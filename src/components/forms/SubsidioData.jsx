import Card from '@/components/ui/Card'
import Textarea from '@/components/ui/Textarea'
import { SelectForm } from '@/components/giro/forms'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_red.css'
import { useState, useEffect } from 'react'

const tiposSubsidio = [
  { id: 'APOYO_ESCOLAR', nombre: 'Apoyo Escolar' },
  { id: 'APOYO_SECUNDARIO', nombre: 'Apoyo Secundario' },
  { id: 'APOYO_TRABAJADOR_UNIVERISITARIO', nombre: 'Apoyo Trabajador/Universitario' },
  { id: 'CASAMIENTO', nombre: 'Casamiento' },
  { id: 'FALLECIMIENTO_DE_FAMILIAR_DIRECTO', nombre: 'Fallecimiento de Familiar Directo' },
  { id: 'FALLECIMIENTO_DEL_TITULAR', nombre: 'Fallecimiento del Titular' },
  { id: 'NACIMIENTO', nombre: 'Nacimiento' }
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
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
      ],
      longhand: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]
    }
  }
}

function SubsidioData ({ register, setValue, errors }) {
  const [picker, setPicker] = useState(null)
  const [picker2, setPicker2] = useState(null)

  useEffect(() => {
    register('fechaSolicitud')
    register('fechaOtorgamiento')
  }, [register])

  const handleDateChange = (date, field) => {
    if (field === 'fechaSolicitud') {
      setPicker(date)
      setValue(field, date[0])
    } else if (field === 'fechaOtorgamiento') {
      setPicker2(date)
      setValue(field, date[0])
    }
  }

  return (
    <>
      <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
        Subsidios
      </h4>

      <Card>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label htmlFor='default-picker' className='form-label'>
              Tipo de Subsidio
              <strong className='obligatorio'>(*)</strong>
            </label>

            <SelectForm
              register={register('tipoSubsidio')}
              options={tiposSubsidio}
              error={errors.tipoSubsidio}
            />
          </div>

          <div>
            <label htmlFor='fechaSolicitud' className='form-label'>
              Fecha de Solicitud
              <strong className='obligatorio'>(*)</strong>
            </label>
            <Flatpickr
              options={flatpickrOptions}
              className='form-control py-2 flatPickrBG dark:flatPickrBGDark'
              value={picker}
              id='fechaSolicitud'
              placeholder='Fecha de Solicitud'
              error={errors.fechaSolicitud}
              onChange={(date) => handleDateChange(date, 'fechaSolicitud')}
            />
            <input type='hidden' {...register('fechaSolicitud')} />
          </div>

          <div>
            <label htmlFor='fechaOtorgamiento' className='form-label'>
              Fecha de Otorgamiento
            </label>
            <Flatpickr
              options={flatpickrOptions}
              className='form-control py-2 flatPickrBG dark:flatPickrBGDark'
              value={picker2}
              id='fechaOtorgamiento'
              placeholder='Fecha de Otorgamiento'
              onChange={(date) => handleDateChange(date, 'fechaOtorgamiento')}
            />
            <input type='hidden' {...register('fechaOtorgamiento')} />
          </div>

          <div>
            <label htmlFor='observaciones' className='form-label'>
              Observaciones
            </label>
            <Textarea
              name='observaciones'
              register={register}
              placeholder='Observaciones'
            />
          </div>
        </div>
      </Card>
    </>
  )
}

export default SubsidioData
