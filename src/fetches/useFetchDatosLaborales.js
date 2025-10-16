import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sutepaApi } from '@/api'
import { handleData, setErrorMessage } from '@/store/dataAfiliado'

const useFetchDatosLaborales = () => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const {
    ugl,
    agrupamiento,
    seccional,
    tramo
  } = useSelector(state => state.dataAfiliado)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetches = []

        // Agrega las peticiones necesarias
        if (!ugl.length) fetches.push(sutepaApi.get('ugl').then(res => ({ type: 'ugl', data: res.data.data })))
        if (!agrupamiento.length) fetches.push(sutepaApi.get('agrupamiento').then(res => ({ type: 'agrupamiento', data: res.data.data })))
        if (!seccional.length) fetches.push(sutepaApi.get('seccionalAll').then(res => ({ type: 'seccional', data: res.data.data })))
        if (!tramo.length) fetches.push(sutepaApi.get('tramo').then(res => ({ type: 'tramo', data: res.data.data })))

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
  }, [dispatch, ugl.length, agrupamiento.length, tramo.length, seccional.length])

  return {
    ugl,
    agrupamiento,
    seccional,
    tramo,
    isLoading
  }
}

export default useFetchDatosLaborales
