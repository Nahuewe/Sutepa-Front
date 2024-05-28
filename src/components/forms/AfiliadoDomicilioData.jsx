import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Numberinput from '@/components/ui/Numberinput'
import { SelectForm } from '@/components/sutepa/forms'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { updateDomicilio } from '../../store/ingreso'
import { useDispatch } from 'react-redux'

function AfiliadoDomicilioData ({ register, disabled, setValue }) {
  const [codigoPostal, setCodigoPostal] = useState('')
  const [provincias, setProvincias] = useState([])
  const [localidades, setLocalidades] = useState([])
  const [domicilio, setDomicilio] = useState('')
  const [selectedProvincia, setSelectedProvincia] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const response = await axios.get('https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre')
        const provinciasData = [...new Set(response.data.provincias.map(provincia => provincia.nombre.toUpperCase()))].sort((a, b) => a.localeCompare(b, 'es', { ignorePunctuation: true }))
        const formattedProvincias = provinciasData.map(provincia => ({
          id: provincia.toLowerCase(),
          nombre: provincia
        }))
        setProvincias(formattedProvincias)
      } catch (error) {
        console.error('Error fetching provincias:', error)
      }
    }

    fetchProvincias()
  }, [])

  const fetchLocalidades = async (provinciaId) => {
    try {
      const response = await axios.get(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${provinciaId}&campos=nombre&max=5000`)
      const localidadesData = [...new Set(response.data.localidades.map(localidad => localidad.nombre.toUpperCase()))].sort((a, b) => a.localeCompare(b, 'es', { ignorePunctuation: true }))
      const formattedLocalidades = localidadesData.map(localidad => ({
        id: localidad.toLowerCase(),
        nombre: localidad
      }))
      setLocalidades(formattedLocalidades)
    } catch (error) {
      console.error('Error fetching localidades:', error)
    }
  }

  const handleDomicilioChange = (e) => {
    const value = e.target.value
    setDomicilio(value)
  }

  const handleProvinciaChange = (e) => {
    const provinciaId = e.target.value
    setSelectedProvincia(provinciaId)
    setValue('provincia', provinciaId)
    fetchLocalidades(provinciaId)
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

  useEffect(() => {
    if (codigoPostal && selectedProvincia && localidades.length > 0) {
      const domicilioData = {
        domicilio,
        provincia: selectedProvincia,
        localidad: localidades[0].id,
        codigo_postal: codigoPostal
      }

      dispatch(updateDomicilio(domicilioData))
    }
  }, [codigoPostal, selectedProvincia, localidades, domicilio])

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
            onChange={handleDomicilioChange}
          />

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Provincia
            </label>
            <SelectForm
              register={register('provincia')}
              options={provincias}
              onChange={handleProvinciaChange}
              disabled={disabled}
            />
          </div>

          <div>
            <label htmlFor='default-picker' className='form-label'>
              Localidad
            </label>
            <SelectForm
              register={register('localidad')}
              options={localidades}
              disabled={disabled || !selectedProvincia}
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
