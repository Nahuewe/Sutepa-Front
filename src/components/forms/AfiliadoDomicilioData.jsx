import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Numberinput from '@/components/ui/Numberinput'
import { SelectForm } from '@/components/giro/forms'
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

function AfiliadoDomicilioData ({ register, errors, setValue }) {
  const [codigoPostal, setCodigoPostal] = useState('')

  const handleCodigoPostalChange = (e) => {
    const value = e.target.value
    const cleanedValue = value.replace(/[^\d]/g, '')
    const codigoPostalFormat = /^(\d{0,4})$/
    let formattedCodigoPostal = ''

    if (cleanedValue.length > 4) {
      return
    }

    if (cleanedValue.length > 0) {
      formattedCodigoPostal = cleanedValue.replace(codigoPostalFormat, '$1')
    } else {
      formattedCodigoPostal = cleanedValue
    }

    setCodigoPostal(formattedCodigoPostal)
    setCodigoPostal(value)
    setValue('codigoPostal', value)
  }

  useEffect(() => {
    register('domicilio')
    register('provincia')
    register('localidad')
    register('codigoPostal')
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
            placeholder='Domicilio'
            error={errors.domicilio}
          />

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Provincia
              <strong className='obligatorio'>(*)</strong>
            </label>
            <SelectForm
              register={register('provincia')}
              options={tipoDocumento}
              error={errors.provincia}
            />
          </div>

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Localidad
              <strong className='obligatorio'>(*)</strong>
            </label>
            <SelectForm
              register={register('localidad')}
              options={tipoDocumento}
              error={errors.localidad}
            />
          </div>

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Codigo Postal
            </label>
            <Numberinput
              register={register}
              id='codigoPostal'
              placeholder='Codigo Postal'
              value={codigoPostal}
              error={errors.codigoPostal}
              onChange={handleCodigoPostalChange}
            />
          </div>
        </div>
      </Card>
    </>
  )
}

export default AfiliadoDomicilioData
