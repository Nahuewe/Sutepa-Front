/* eslint-disable camelcase */
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sutepaApi } from '@/api'
import Loading from '@/components/Loading'
import { SelectForm } from '@/components/sutepa/forms'
import Card from '@/components/ui/Card'
import Numberinput from '@/components/ui/Numberinput'
import Textinput from '@/components/ui/Textinput'
import useFetchDomicilio from '@/fetches/useFetchDomicilio'
import { updateDomicilio } from '@/store/afiliado'

function AfiliadoDomicilioData ({ register, disabled, setValue }) {
  const dispatch = useDispatch()
  const [codigoPostal, setCodigoPostal] = useState('')
  const [localidades, setLocalidades] = useState([])
  const [domicilio, setDomicilio] = useState('')
  const [selectedProvincia, setSelectedProvincia] = useState('')
  const [selectedLocalidad, setSelectedLocalidad] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { provincia } = useFetchDomicilio()
  const { activeAfiliado } = useSelector(state => state.afiliado)
  const [reloadKey, setReloadKey] = useState(0)

  async function handleLocalidad (provinciaId) {
    try {
      const response = await sutepaApi.get(`localidades/${provinciaId}`)
      const { data } = response.data
      const sortedData = data.sort((a, b) => a.nombre.localeCompare(b.nombre))
      setLocalidades(sortedData)

      if (selectedProvincia === provinciaId && activeAfiliado?.domicilios?.localidad_id) {
        const localidad = sortedData.find(localidad => localidad.id === activeAfiliado.domicilios.localidad_id)
        if (localidad) {
          setSelectedLocalidad(localidad.id)
        }
      }
    } catch (error) {
      console.error('Error al obtener localidades:', error)
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

  const handleProvinciaChange = async (e) => {
    const value = parseInt(e.target.value)
    setSelectedProvincia(value)
    setValue('provincia_id', value)
    setLocalidades([])
    await handleLocalidad(value)
  }

  useEffect(() => {
    if (selectedProvincia) {
      handleLocalidad(selectedProvincia)
    } else {
      setLocalidades([])
    }
  }, [selectedProvincia])

  const handleLocalidadChange = (e) => {
    const value = parseInt(e.target.value)
    setSelectedLocalidad(value)
    setValue('localidad_id', value)
  }

  useEffect(() => {
    if (activeAfiliado?.domicilios?.provincia_id) {
      handleLocalidad(activeAfiliado.domicilios.provincia_id)
    }
  }, [activeAfiliado?.domicilios?.provincia_id])

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
    }
  }, [activeAfiliado, setValue])

  useEffect(() => {
    const domicilioData = {
      domicilio,
      provincia_id: selectedProvincia,
      localidad_id: selectedLocalidad,
      codigo_postal: codigoPostal
    }
    dispatch(updateDomicilio(domicilioData))
  }, [domicilio, selectedProvincia, selectedLocalidad, codigoPostal, dispatch])

  async function loadingAfiliado () {
    !isLoading && setIsLoading(true)
    setIsLoading(false)
  }

  useEffect(() => {
    loadingAfiliado()
  }, [])

  useEffect(() => {
    if (provincia.length) {
      setIsLoading(false)
    }
  }, [provincia])

  useEffect(() => {
    if (activeAfiliado) {
      const intervals = [2000, 6000]
      const timers = intervals.map((interval) =>
        setTimeout(() => {
          setReloadKey((prevKey) => prevKey + 1)
        }, interval)
      )

      return () => timers.forEach(clearTimeout)
    }
  }, [activeAfiliado])

  return (
    <div key={reloadKey}>
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
                  options={provincia}
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
    </div>
  )
}

export default AfiliadoDomicilioData
