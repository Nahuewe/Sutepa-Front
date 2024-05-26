import Card from '@/components/ui/Card'
import Textarea from '@/components/ui/Textarea'
import { SelectForm } from '@/components/sutepa/forms'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_red.css'
import { useState } from 'react'
import { Icon } from '@iconify/react'
import Tooltip from '@/components/ui/Tooltip'
import { useSelector, useDispatch } from 'react-redux'
import { onAddSubsidio } from '../../store/ingreso'

const initialForm = {
  tipo_subsidio: '',
  fecha_solicitud: null,
  fecha_otorgamiento: null,
  observaciones: ''
}

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
      longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    },
    months: {
      shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    }
  }
}

function SubsidioData ({ register, setValue, disabled }) {
  const dispatch = useDispatch()
  const [picker, setPicker] = useState(null)
  const [picker2, setPicker2] = useState(null)
  const [formData, setFormData] = useState(initialForm)
  const [subsidios, setSubsidios] = useState([])
  const { user } = useSelector(state => state.auth)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleDateChange = (date, field) => {
    setFormData({
      ...formData,
      [field]: date[0]
    })
    setValue(field, date[0])
    if (field === 'fecha_solicitud') {
      setPicker(date)
      setValue(field, date[0])
    } else if (field === 'fecha_otorgamiento') {
      setPicker2(date)
      setValue(field, date[0])
    }
  }

  const agregarSubsidio = () => {
    console.log('Adding subsidy with data:', formData)
    const nuevoSubsidio = {
      ...formData,
      fecha_carga: new Date().toLocaleDateString('es-ES'),
      fecha_solicitud: new Date(formData.fecha_solicitud).toLocaleDateString('es-ES'),
      fecha_otorgamiento: new Date(formData.fecha_otorgamiento).toLocaleDateString('es-ES')
    }
    dispatch(onAddSubsidio(nuevoSubsidio))
    setSubsidios([...subsidios, nuevoSubsidio])
    setFormData(initialForm)
    setPicker(null)
    setPicker2(null)
  }

  const onDelete = (id) => {
    const newSubsidios = subsidios.filter(subsidio => subsidio.id !== id)
    setSubsidios(newSubsidios)
  }

  return (
    <>
      <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
        Subsidios
      </h4>

      <Card>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label htmlFor='tipo_subsidio' className='form-label'>
              Tipo de Subsidio
            </label>
            <SelectForm
              register={register('tipo_subsidio')}
              options={tiposSubsidio}
              value={formData.tipo_subsidio}
              onChange={handleInputChange}
              disabled={disabled}
            />
          </div>
          <div>
            <label htmlFor='fecha_solicitud' className='form-label'>
              Fecha de Solicitud
            </label>
            <Flatpickr
              options={flatpickrOptions}
              className='form-control py-2 flatPickrBG dark:flatPickrBGDark dark:placeholder-white placeholder-black-500'
              value={picker}
              id='fecha_solicitud'
              name='fecha_solicitud'
              placeholder='Ingrese la fecha de solicitud'
              onChange={(date) => handleDateChange(date, 'fecha_solicitud')}
              disabled={disabled}
            />
            <input type='hidden' {...register('fecha_solicitud')} />
          </div>
          <div>
            <label htmlFor='fecha_otorgamiento' className='form-label'>
              Fecha de Otorgamiento
            </label>
            <Flatpickr
              options={flatpickrOptions}
              className='form-control py-2 flatPickrBG dark:flatPickrBGDark dark:placeholder-white placeholder-black-500'
              value={picker2}
              id='fecha_otorgamiento'
              name='fecha_otorgamiento'
              placeholder='Ingrese la fecha de otorgamiento'
              onChange={(date) => handleDateChange(date, 'fecha_otorgamiento')}
              disabled={disabled}
            />
            <input type='hidden' {...register('fecha_otorgamiento')} />
          </div>
          <div>
            <label htmlFor='observaciones' className='form-label'>
              Observaciones
            </label>
            <Textarea
              name='observaciones'
              value={formData.observaciones}
              onChange={handleInputChange}
              register={register}
              placeholder='Ingrese algunas observaciones'
              disabled={disabled}
            />
          </div>
        </div>
        <div className='flex justify-end mt-4'>
          <button
            type='button'
            className='btn btn-primary rounded-lg'
            onClick={agregarSubsidio}
            disabled={disabled}
          >
            Agregar Subsidio
          </button>
        </div>
      </Card>

      {subsidios.length > 0 && (
        <div className='overflow-x-auto mt-4'>
          <table className='table-auto w-full'>
            <thead className='bg-gray-300 dark:bg-gray-700'>
              <tr>
                <th className='px-4 py-2 text-center dark:text-white'>Fecha de Carga</th>
                <th className='px-4 py-2 text-center dark:text-white'>Tipo de Subsidio</th>
                <th className='px-4 py-2 text-center dark:text-white'>Fecha de Solicitud</th>
                <th className='px-4 py-2 text-center dark:text-white'>Fecha de Otorgamiento</th>
                <th className='px-4 py-2 text-center dark:text-white'>Observaciones</th>
                <th className='px-4 py-2 text-center dark:text-white'>Usuario de Carga</th>
                <th className='px-4 py-2 text-center dark:text-white'>Acciones</th>
              </tr>
            </thead>
            <tbody className='divide-y dark:divide-gray-700'>
              {subsidios.map((subsidio, index) => (
                <tr key={index} className='bg-white dark:bg-gray-800 dark:border-gray-700'>
                  <td className='px-4 py-2 text-center dark:text-white'>{subsidio.fecha_carga}</td>
                  <td className='px-4 py-2 text-center dark:text-white'>{subsidio.tipo_subsidio}</td>
                  <td className='px-4 py-2 text-center dark:text-white'>{subsidio.fecha_solicitud}</td>
                  <td className='px-4 py-2 text-center dark:text-white'>{subsidio.fecha_otorgamiento}</td>
                  <td className='px-4 py-2 text-center dark:text-white'>{subsidio.observaciones}</td>
                  <td className='px-4 py-2 text-center dark:text-white'>{user.nombre}</td>
                  <td className='text-center py-2'>
                    <Tooltip content='Eliminar'>
                      <button
                        type='button'
                        onClick={() => onDelete(subsidio.id)}
                        className='text-red-600 hover:text-red-900'
                      >
                        <Icon icon='heroicons:trash' width='24' height='24' />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default SubsidioData
