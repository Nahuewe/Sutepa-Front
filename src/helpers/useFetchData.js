// useFetchData.js
import { useEffect, useState } from 'react'
import { sutepaApi } from '../api'

const useFetchData = () => {
  const [estadoCivil, setEstadoCivil] = useState([])
  const [nacionalidad, setNacionalidad] = useState([])
  const [sexo, setSexo] = useState([])
  const [agrupamiento, setAgrupamiento] = useState([])
  const [seccional, setSeccional] = useState([])
  const [ugl, setUgl] = useState([])
  const [tramo, setTramo] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          estadoCivilResponse,
          nacionalidadResponse,
          sexoResponse,
          agrupamientoResponse,
          seccionalResponse,
          uglResponse,
          tramoResponse
        ] = await Promise.all([
          sutepaApi.get('estadocivil'),
          sutepaApi.get('nacionalidad'),
          sutepaApi.get('sexo'),
          sutepaApi.get('agrupamiento'),
          sutepaApi.get('seccional'),
          sutepaApi.get('ugl'),
          sutepaApi.get('tramo')
        ])
        setEstadoCivil(estadoCivilResponse.data.data)
        setNacionalidad(nacionalidadResponse.data.data)
        setSexo(sexoResponse.data.data)
        setAgrupamiento(agrupamientoResponse.data.data)
        setSeccional(seccionalResponse.data.data)
        setUgl(uglResponse.data.data)
        setTramo(tramoResponse.data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  return {
    estadoCivil,
    nacionalidad,
    sexo,
    agrupamiento,
    seccional,
    ugl,
    tramo
  }
}

export default useFetchData
