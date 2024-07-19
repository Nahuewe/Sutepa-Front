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
  const [isDataLoading, setIsDataLoading] = useState(true)
  const { activeAfiliado } = useSelector(state => state.afiliado)

  async function handleProvincia () {
    try {
      const response = await sutepaApi.get('provincia')
      const { data } = response.data
      setProvincias(data)
      console.log('Provincias cargadas:', data)
    } catch (error) {
      console.error('Error al obtener provincias:', error)
    }
  }

  async function handleLocalidad (id) {
    try {
      console.log('Cargando localidades para la provincia con id:', id)
      const response = await sutepaApi.get(`localidad/${id}`)
      const { data } = response.data

      const sortedData = data.sort((a, b) => a.nombre.localeCompare(b.nombre))
      setLocalidades(sortedData)
      console.log('Localidades cargadas:', sortedData)

      // Si se ha seleccionado una localidad anteriormente, reestablecer el valor
      if (selectedProvincia === id && activeAfiliado?.domicilios?.localidad_id) {
        const localidad = sortedData.find(localidad => localidad.id === activeAfiliado.domicilios.localidad_id)
        if (localidad) {
          setSelectedLocalidad(localidad.id)
          console.log('Localidad seleccionada automáticamente:', localidad.id)
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
    console.log('Localidad seleccionada:', value)
    setSelectedLocalidad(value)
    setValue('localidad_id', value)
  }

  useEffect(() => {
    if (activeAfiliado?.domicilios?.provincia_id) {
      console.log('Cargando localidades para provincia_id desde activeAfiliado:', activeAfiliado.domicilios.provincia_id)
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
      setIsDataLoading(false)
    }
  }, [activeAfiliado, setValue])

  useEffect(() => {
    if (codigoPostal && selectedProvincia && selectedLocalidad) {
      const domicilioData = {
        domicilio,
        provincia_id: selectedProvincia,
        localidad_id: selectedLocalidad,
        codigo_postal: codigoPostal
      }
      console.log('Dispatching updateDomicilio con datos:', domicilioData)
      dispatch(updateDomicilio(domicilioData))
    }
  }, [codigoPostal, selectedProvincia, selectedLocalidad, domicilio, dispatch])

  async function loadingAfiliado () {
    !isLoading && setIsLoading(true)
    await handleProvincia()
    setIsLoading(false)
  }

  useEffect(() => {
    loadingAfiliado()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(async () => {
        setIsDataLoading(true)
        await handleProvincia()
        if (selectedProvincia) {
          await handleLocalidad(selectedProvincia)
        }
        setIsDataLoading(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isLoading, selectedProvincia])

  return (
    <>
      {isLoading
        ? (
          <Loading className='mt-28 md:mt-64' />
          )
        : (
            isDataLoading
              ? (
                <Loading className='mt-28 md:mt-64' /> // Segundo loading mientras se cargan los datos
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
                )
          )}
    </>
  )
}

export default AfiliadoDomicilioData
