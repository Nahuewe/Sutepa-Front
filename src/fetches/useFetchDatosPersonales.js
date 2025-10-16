import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sutepaApi } from '@/api'
import { handleData, setErrorMessage } from '@/store/dataAfiliado'

const useFetchDatosPersonales = () => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const {
    legajos,
    sexo,
    estadoCivil,
    nacionalidad
  } = useSelector(state => state.dataAfiliado)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetches = []

        // Agrega las peticiones necesarias
        if (!legajos.length) fetches.push(sutepaApi.get('legajos').then(res => ({ type: 'legajos', data: res.data })))
        if (!sexo.length) fetches.push(sutepaApi.get('sexo').then(res => ({ type: 'sexo', data: res.data.data })))
        if (!estadoCivil.length) fetches.push(sutepaApi.get('estadocivil').then(res => ({ type: 'estadoCivil', data: res.data.data })))
        if (!nacionalidad.length) fetches.push(sutepaApi.get('nacionalidad').then(res => ({ type: 'nacionalidad', data: res.data.data })))

        // Si no hay peticiones pendientes, los datos ya están cargados
        if (fetches.length === 0) {
          setIsLoading(false)
          return
        }

        // Ejecuta las peticiones
        const results = await Promise.all(fetches)

        // Actualiza el estado
        results.forEach(({ type, data }) => {
          dispatch(handleData({ type, data }))
        })

        setIsLoading(false)
      } catch (error) {
        dispatch(setErrorMessage('Error fetching data'))
        console.error('Error fetching data:', error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dispatch, legajos.length, sexo.length, estadoCivil.length, nacionalidad.length])

  return {
    legajos,
    sexo,
    estadoCivil,
    nacionalidad,
    isLoading
  }
}

export default useFetchDatosPersonales
