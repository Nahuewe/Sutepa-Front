/* eslint-disable camelcase */
import { SelectForm } from '@/components/sutepa/forms'
import { useState, useEffect } from 'react'
import { updateDomicilio } from '@/store/afiliado'
import { useDispatch, useSelector } from 'react-redux'
import { sutepaApi } from '@/api'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Numberinput from '@/components/ui/Numberinput'
import Loading from '@/components/Loading'

function AfiliadoDomicilioData ({ register, disabled, setValue }) {
  const dispatch = useDispatch()
  const [codigoPostal, setCodigoPostal] = useState('')
  const [provincias, setProvincias] = useState([])
  const [localidades, setLocalidades] = useState([])
  const [domicilio, setDomicilio] = useState('')
  const [selectedProvincia, setSelectedProvincia] = useState('')
  const [selectedLocalidad, setSelectedLocalidad] = useState('')
  const [isLoading, setIsLoading] = useState(true)
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

    if (activeAfiliado?.domicilios?.localidad_id) {
      const selectedLocalidad = data.find(localidad => localidad.id === activeAfiliado.domicilios.localidad_id)
      if (selectedLocalidad) {
        setSelectedLocalidad(activeAfiliado.domicilios.localidad_id)
        setValue('localidad_id', activeAfiliado.domicilios.localidad_id)
      } else {
        setSelectedLocalidad(data.length > 0 ? data[0].id : null)
        setValue('localidad_id', data.length > 0 ? data[0].id : null)
      }
    } else {
      setSelectedLocalidad(data.length > 0 ? data[0].id : null)
      setValue('localidad_id', data.length > 0 ? data[0].id : null)
    }
  }

  const handleDomicilioChange = (e) => {
    const value = e.target.value
    setDomicilio(value)
    setValue('domicilio', value)
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
    setValue('provincia_id', value)
    handleLocalidad(value)
  }

  const handleLocalidadChange = (e) => {
    const value = parseInt(e.target.value)
    setSelectedLocalidad(value)
    setValue('localidad_id', value)
  }

  useEffect(() => {
    if (codigoPostal && selectedProvincia && selectedLocalidad) {
      const domicilioData = {
        domicilio,
        provincia_id: selectedProvincia,
        localidad_id: selectedLocalidad,
        codigo_postal: codigoPostal
      }
      dispatch(updateDomicilio(domicilioData))
    }
  }, [codigoPostal, selectedProvincia, selectedLocalidad, domicilio, dispatch])

  useEffect(() => {
    if (activeAfiliado?.domicilios) {
      const { domicilio, provincia_id, localidad_id, codigo_postal } = activeAfiliado.domicilios
      setDomicilio(domicilio)
      setSelectedProvincia(provincia_id)
      setSelectedLocalidad(localidad_id)
      setCodigoPostal(codigo_postal)
      setValue('domicilio', domicilio)
      setValue('provincia_id', provincia_id)
      setValue('localidad_id', localidad_id)
      setValue('codigo_postal', codigo_postal)
      handleLocalidad(provincia_id)
    }
  }, [activeAfiliado, setValue])

  async function loadingAfiliado () {
    !isLoading && setIsLoading(true)
    await handleProvincia()
    if (activeAfiliado?.domicilios?.provincia_id) {
      await handleLocalidad(activeAfiliado.domicilios.provincia_id)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadingAfiliado()
  }, [])

  return (
    <>
      {isLoading
        ? (
          <Loading className='mt-28 md:mt-64' />
          )
        : (
          <div>
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
                  value={domicilio}
                  onChange={handleDomicilioChange}
                />

                <SelectForm
                  register={register('provincia_id')}
                  title='Provincia'
                  options={provincias}
                  value={selectedProvincia}
                  onChange={handleProvinciaChange}
                />

                <div>
                  <SelectForm
                    register={register('localidad_id')}
                    title='Localidad'
                    options={localidades}
                    value={selectedLocalidad}
                    onChange={handleLocalidadChange}
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
          </div>
          )}
    </>
  )
}

export default AfiliadoDomicilioData
