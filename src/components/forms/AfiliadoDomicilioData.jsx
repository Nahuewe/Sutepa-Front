import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Numberinput from '@/components/ui/Numberinput'
import { SelectForm } from '@/components/sutepa/forms'
import { useState, useEffect } from 'react'

const tipoDocumento = [
  {
    id: 'CATAMARCA',
    nombre: 'CATAMARCA'
  },
  {
    id: 'BUENOS AIRES',
    nombre: 'BUENOS AIRES'
  }
]

function AfiliadoDomicilioData ({ register, disabled, setValue }) {
  const [codigoPostal, setCodigoPostal] = useState('')

  const handleCodigoPostalChange = (e) => {
    const value = e.target.value
    const cleanedValue = value.replace(/[^\d]/g, '')
    const maxLength = 4

    if (cleanedValue.length > maxLength) {
      return
    }

    setCodigoPostal(cleanedValue)
    setValue('codigo_postal', cleanedValue)
  }

  useEffect(() => {
    register('domicilio')
    register('provincia_id')
    register('localidad_id')
    register('codigo_postal')
  }, [register])

  return (
    <>
      <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
        Datos del Domicilio
      </h4>

      <Card>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Textinput
            name='domicilio'
            label='Domicilio'
            register={register}
            placeholder='Ingrese el domicilio'
            disabled={disabled}
          />

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Provincia
            </label>
            <SelectForm
              register={register('provincia_id')}
              options={tipoDocumento}
              disabled={disabled}
            />
          </div>

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Localidad
            </label>
            <SelectForm
              register={register('localidad_id')}
              options={tipoDocumento}
              disabled={disabled}
            />
          </div>

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Codigo Postal
            </label>
            <Numberinput
              register={register}
              id='codigo_postal'
              placeholder='Ingrese el código postal'
              value={codigoPostal}
              onChange={handleCodigoPostalChange}
              disabled={disabled}
            />
          </div>
        </div>
      </Card>
    </>
  )
}

export default AfiliadoDomicilioData
