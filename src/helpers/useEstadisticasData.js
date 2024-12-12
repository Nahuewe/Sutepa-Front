import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { sutepaApi } from '@/api'
import { handleData, setErrorMessage } from '@/store/dataEstadisticas'

const useEstadisticasData = () => {
  const dispatch = useDispatch()

  // Selecciona el estado de Redux
  const {
    userAll,
    seccionalAll,
    personaAll,
    estadisticas
  } = useSelector(state => state.dataEstadisticas)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetches = []

        // Agrega las peticiones necesarias
        if (!userAll.length) fetches.push(sutepaApi.get('userAll').then(res => ({ type: 'userAll', data: res.data.data })))
        if (!seccionalAll.length) fetches.push(sutepaApi.get('seccionalAll').then(res => ({ type: 'seccionalAll', data: res.data.data })))
        if (!personaAll.length) fetches.push(sutepaApi.get('personaAll').then(res => ({ type: 'personaAll', data: res.data.data })))
        if (!estadisticas.length) fetches.push(sutepaApi.get('estadisticas').then(res => ({ type: 'estadisticas', data: res.data })))

        // Ejecuta las peticiones
        const results = await Promise.all(fetches)

        // Actualiza el estado
        results.forEach(({ type, data }) => {
          dispatch(handleData({ type, data }))
        })
      } catch (error) {
        dispatch(setErrorMessage('Error fetching data'))
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [dispatch])

  return {
    userAll,
    seccionalAll,
    personaAll,
    estadisticas
  }
}

export default useEstadisticasData