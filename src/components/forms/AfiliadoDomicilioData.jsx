import { SelectForm } from '@/components/sutepa/forms'
import { useState, useEffect } from 'react'
import { updateDomicilio } from '@/store/afiliado'
import { useDispatch, useSelector } from 'react-redux'
import { sutepaApi } from '@/api'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Numberinput from '@/components/ui/Numberinput'

function AfiliadoDomicilioData ({ register, disabled, setValue }) {
  const dispatch = useDispatch()
  const [codigoPostal, setCodigoPostal] = useState('')
  const [provincias, setProvincias] = useState([])
  const [localidades, setLocalidades] = useState([])
  const [domicilio, setDomicilio] = useState('')
  const [selectedProvincia, setSelectedProvincia] = useState('')
  const { activeAfiliado } = useSelector(state => state.afiliado)

  async function handleProvincia () {
    const response = await sutepaApi.get('provincia')
    const { data } = response.data
    setProvincias(data)
  }

  async function handleLocalidad (id) {
    const response = await sutepaApi.get(`localidad/${id}`)
    const { data } = response.data
    setLocalidades(data)
  }

  const handleDomicilioChange = (e) => {
    const value = e.target.value
    setDomicilio(value)
  }

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

  const handleProvinciaChange = (e) => {
    const value = parseInt(e.target.value)
    setSelectedProvincia(value)
    handleLocalidad(value)
  }

  useEffect(() => {
    if (codigoPostal && selectedProvincia && localidades.length > 0) {
      const domicilioData = {
        domicilio,
        provincia_id: selectedProvincia,
        localidad_id: localidades[0].id,
        codigo_postal: codigoPostal
      }

      dispatch(updateDomicilio(domicilioData))
    }
  }, [codigoPostal, selectedProvincia, localidades, domicilio, dispatch])

  useEffect(() => {
    if (activeAfiliado?.domicilio) {
      activeAfiliado.domicilio.forEach(item => {
        dispatch(updateDomicilio(item))
      })
    }
  }, [])

  useEffect(() => {
    handleProvincia()
  }, [])

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
            className='mayuscula'
            register={register}
            placeholder='Ingrese el domicilio'
            onChange={handleDomicilioChange}
          />

          <SelectForm
            register={register('provincia_id')}
            title='Provincia'
            options={provincias}
            onChange={handleProvinciaChange}
          />

          <div>
            <SelectForm
              register={register('localidad_id')}
              title='Localidad'
              options={localidades}
              disabled={disabled || !selectedProvincia}
            />
          </div>

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Código Postal
            </label>
            <Numberinput
              register={register}
              id='codigo_postal'
              placeholder='Ingrese el código postal'
              value={codigoPostal}
              onChange={handleCodigoPostalChange}
            />
          </div>
        </div>
      </Card>
    </>
  )
}

export default AfiliadoDomicilioData
