import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Numberinput from '@/components/ui/Numberinput'
import { SelectForm } from '@/components/sutepa/forms'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_red.css'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateDatosLaborales } from '../../store/ingreso'

const tipoContrato = [
  { id: 'PLANTA PERMANENTE', nombre: 'PLANTA PERMANENTE' },
  { id: 'CONTRATO', nombre: 'CONTRATO' }
]

const agrupamiento = [
  { id: 1, nombre: 'ADMINISTRATIVO' },
  { id: 2, nombre: 'CONTRATADO' },
  { id: 3, nombre: 'PROFESIONAL' },
  { id: 4, nombre: 'SERVICIOS GENERALES' },
  { id: 5, nombre: 'TECNICO' }
]

const seccional = [
  { id: 1, nombre: 'LANUS' },
  { id: 2, nombre: 'BAHIA BLANCA' },
  { id: 3, nombre: 'CAPITAL FEDERAL' },
  { id: 4, nombre: 'CORDOBA' },
  { id: 5, nombre: 'CORRIENTES' },
  { id: 6, nombre: 'CHUBUT' },
  { id: 7, nombre: 'DAMNPYP' },
  { id: 8, nombre: 'ENTRE RIOS' },
  { id: 9, nombre: 'LA PLATA' },
  { id: 10, nombre: 'LA PAMPA' },
  { id: 11, nombre: 'LUJAN' },
  { id: 12, nombre: 'MENDOZA' },
  { id: 13, nombre: 'MILSTEIN' },
  { id: 14, nombre: 'MISIONES' },
  { id: 15, nombre: 'ROSARIO' },
  { id: 16, nombre: 'SALTA' },
  { id: 17, nombre: 'SAN JUSTO' },
  { id: 18, nombre: 'SAN JUAN' },
  { id: 19, nombre: 'TUCUMAN' },
  { id: 20, nombre: 'CHIVILCOY' },
  { id: 21, nombre: 'AZUL' },
  { id: 22, nombre: 'NACIONAL' },
  { id: 23, nombre: 'CATAMARCA' },
  { id: 24, nombre: 'CHACO' },
  { id: 25, nombre: 'TIERRA DEL FUEGO' }
]

const ugl = [
  { id: 1, nombre: 'LANUS' },
  { id: 2, nombre: 'MAR DEL PLATA' },
  { id: 3, nombre: 'SALTA' },
  { id: 4, nombre: 'CHACO' },
  { id: 5, nombre: 'ENTRE RIOS' },
  { id: 6, nombre: 'SANTA FE' },
  { id: 7, nombre: 'NEUQUEN' },
  { id: 8, nombre: 'CHUBUT' },
  { id: 9, nombre: 'MISIONES' },
  { id: 10, nombre: 'SANTIAGO DEL ESTERO' },
  { id: 11, nombre: 'LA PAMPA' },
  { id: 12, nombre: 'SAN JUAN' },
  { id: 13, nombre: 'JUJUY' },
  { id: 14, nombre: 'FORMOSA' },
  { id: 15, nombre: 'CATAMARCA' },
  { id: 16, nombre: 'LA RIOJA' },
  { id: 17, nombre: 'SAN LUIS' },
  { id: 18, nombre: 'RIO NEGRO' },
  { id: 19, nombre: 'SANTA CRUZ' },
  { id: 20, nombre: 'MORON' },
  { id: 21, nombre: 'AZUL' },
  { id: 22, nombre: 'JUNIN' },
  { id: 23, nombre: 'LUJAN' },
  { id: 24, nombre: 'TIERRA DEL FUEGO' },
  { id: 25, nombre: 'CONCORDIA' },
  { id: 26, nombre: 'SAN JUSTO' },
  { id: 27, nombre: 'RIO CUARTO' },
  { id: 28, nombre: 'QUILMES' },
  { id: 29, nombre: 'CHIVILCOY' },
  { id: 30, nombre: 'PATAGONIA NORTE' },
  { id: 31, nombre: 'INSSJP - AMBITO NACIONAL' }
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
            options={agrupamiento}
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
            register={register('agrupamiento')}
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
