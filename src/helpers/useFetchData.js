import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { sutepaApi } from '@/api'
import { handleData, setErrorMessage } from '@/store/dataAfiliado'

const useFetchData = () => {
  const dispatch = useDispatch()

  const {
    legajos,
    sexo,
    estadoCivil,
    nacionalidad,
    provincia,
    ugl,
    seccional,
    tramo,
    agrupamiento,
    familia,
    documentacion,
    subsidio
  } = useSelector(state => state.dataAfiliado)

  useEffect(() => {
    const controller = new AbortController()

    const fetchData = async () => {
      try {
        const fetches = []

        const fetchOrCache = (key, url) => {
          const cachedData = localStorage.getItem(key) // Verificar en caché
          if (cachedData) {
            dispatch(handleData({ type: key, data: JSON.parse(cachedData) })) // Cargar desde caché
          } else {
            fetches.push(
              sutepaApi.get(url, { signal: controller.signal })
                .then(res => {
                  const data = res.data.data || res.data
                  localStorage.setItem(key, JSON.stringify(data)) // Guardar en caché
                  return { type: key, data }
                })
            )
          }
        }

        // Cargar datos desde la caché o API
        if (!legajos.length) fetchOrCache('legajos', 'legajos')
        if (!sexo.length) fetchOrCache('sexo', 'sexo')
        if (!estadoCivil.length) fetchOrCache('estadoCivil', 'estadocivil')
        if (!nacionalidad.length) fetchOrCache('nacionalidad', 'nacionalidad')
        if (!provincia.length) fetchOrCache('provincia', 'provincia')
        if (!ugl.length) fetchOrCache('ugl', 'ugl')
        if (!seccional.length) fetchOrCache('seccional', 'seccionalAll')
        if (!agrupamiento.length) fetchOrCache('agrupamiento', 'agrupamiento')
        if (!tramo.length) fetchOrCache('tramo', 'tramo')
        if (!familia.length) fetchOrCache('familia', 'familia')
        if (!documentacion.length) fetchOrCache('documentacion', 'documentacion')
        if (!subsidio.length) fetchOrCache('subsidio', 'subsidio')

        // Ejecuta las peticiones restantes
        const results = await Promise.all(fetches)

        // Actualiza el estado con los datos obtenidos
        results.forEach(({ type, data }) => {
          dispatch(handleData({ type, data }))
        })
      } catch (error) {
        if (error.name !== 'AbortError') {
          dispatch(setErrorMessage('Error fetching data'))
          console.error('Error fetching data:', error)
        }
      }
    }

    fetchData()

    return () => {
      controller.abort() // Cancela todas las peticiones activas
    }
  }, [
    dispatch, legajos.length, sexo.length, estadoCivil.length, nacionalidad.length, provincia.length, ugl.length, seccional.length, agrupamiento.length, tramo.length, familia.length, documentacion.length, subsidio.length
  ])

  return {
    legajos,
    sexo,
    estadoCivil,
    nacionalidad,
    provincia,
    ugl,
    seccional,
    agrupamiento,
    tramo,
    familia,
    documentacion,
    subsidio
  }
}

export default useFetchData
