import Card from '@/components/ui/Card'
import Textarea from '@/components/ui/Textarea'
import { SelectForm } from '@/components/sutepa/forms'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_red.css'
import { useState, useEffect } from 'react'

const tiposSubsidio = [
  { id: 'APOYO_ESCOLAR', nombre: 'APOYO ESCOLAR' },
  { id: 'APOYO_SECUNDARIO', nombre: 'APOYO SECUNDARIO' },
  { id: 'APOYO_TRABAJADOR_UNIVERISITARIO', nombre: 'APOYO TRABAJADOR/UNIVERSITARIO' },
  { id: 'CASAMIENTO', nombre: 'CASAMIENTO' },
  { id: 'FALLECIMIENTO_DE_FAMILIAR_DIRECTO', nombre: 'FALLECIMIENTO DE FAMILIAR DIRECTO' },
  { id: 'FALLECIMIENTO_DEL_TITULAR', nombre: 'FALLECIMIENTO DEL TITULAR' },
  { id: 'NACIMIENTO', nombre: 'NACIMIENTO' }
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

function SubsidioData ({ register, setValue, disabled }) {
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
              disabled={disabled}
            />
          </div>

          <div>
            <label htmlFor='fechaSolicitud' className='form-label'>
              Fecha de Solicitud
              <strong className='obligatorio'>(*)</strong>
            </label>
            <Flatpickr
              options={flatpickrOptions}
              className='form-control py-2 flatPickrBG dark:flatPickrBGDark dark:placeholder-white placeholder-black-500'
              value={picker}
              id='fechaSolicitud'
              placeholder='Ingrese la fecha de solicitud'
              onChange={(date) => handleDateChange(date, 'fechaSolicitud')}
              disabled={disabled}
            />
            <input type='hidden' {...register('fechaSolicitud')} />
          </div>

          <div>
            <label htmlFor='fechaOtorgamiento' className='form-label'>
              Fecha de Otorgamiento
            </label>
            <Flatpickr
              options={flatpickrOptions}
              className='form-control py-2 flatPickrBG dark:flatPickrBGDark dark:placeholder-white placeholder-black-500'
              value={picker2}
              id='fechaOtorgamiento'
              placeholder='Ingese la fecha de otorgamiento'
              onChange={(date) => handleDateChange(date, 'fechaOtorgamiento')}
              disabled={disabled}
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
              placeholder='Ingrese algunas observaciones'
              disabled={disabled}
            />
          </div>
        </div>
      </Card>
    </>
  )
}

export default SubsidioData
