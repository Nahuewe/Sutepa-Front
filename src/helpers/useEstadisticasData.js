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

        // Función para manejar caché
        const fetchOrCache = (key, url) => {
          const cachedData = localStorage.getItem(key) // Verificar en caché
          if (cachedData) {
            dispatch(handleData({ type: key, data: JSON.parse(cachedData) })) // Cargar desde caché
          } else {
            fetches.push(
              sutepaApi.get(url)
                .then(res => {
                  const data = res.data.data || res.data
                  localStorage.setItem(key, JSON.stringify(data)) // Guardar en caché
                  return { type: key, data }
                })
            )
          }
        }

        // Cargar datos desde la caché o API
        if (!userAll.length) fetchOrCache('userAll', 'userAll')
        if (!seccionalAll.length) fetchOrCache('seccionalAll', 'seccionalAll')
        if (!personaAll.length) fetchOrCache('personaAll', 'personaAll')
        if (!estadisticas.length) fetchOrCache('estadisticas', 'estadisticas')

        // Ejecuta las peticiones restantes
        const results = await Promise.all(fetches)

        // Actualiza el estado con los datos obtenidos
        results.forEach(({ type, data }) => {
          dispatch(handleData({ type, data }))
        })
      } catch (error) {
        dispatch(setErrorMessage('Error fetching data'))
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [dispatch, userAll.length, seccionalAll.length, personaAll.length, estadisticas.length])

  return {
    userAll,
    seccionalAll,
    personaAll,
    estadisticas
  }
}

export default useEstadisticasData
