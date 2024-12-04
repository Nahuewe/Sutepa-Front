import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { sutepaApi } from '@/api'
import { handleData, setErrorMessage } from '@/store/dataAfiliado'

const useFetchData = () => {
  const dispatch = useDispatch()

  const {
    legajos,
    estadoCivil,
    provincia,
    nacionalidad,
    familia,
    documentacion,
    subsidio,
    sexo,
    agrupamiento,
    seccional,
    ugl,
    tramo
  } = useSelector(state => state.dataAfiliado)

  useEffect(() => {
    const controller = new AbortController()

    const fetchData = async () => {
      try {
        const fetches = []

        // Agrega las peticiones necesarias
        if (!legajos.length) fetches.push(sutepaApi.get('legajos', { signal: controller.signal }).then(res => ({ type: 'legajos', data: res.data })))
        if (!estadoCivil.length) fetches.push(sutepaApi.get('estadocivil', { signal: controller.signal }).then(res => ({ type: 'estadoCivil', data: res.data.data })))
        if (!provincia.length) fetches.push(sutepaApi.get('provincia', { signal: controller.signal }).then(res => ({ type: 'provincia', data: res.data.data })))
        if (!nacionalidad.length) fetches.push(sutepaApi.get('nacionalidad', { signal: controller.signal }).then(res => ({ type: 'nacionalidad', data: res.data.data })))
        if (!familia.length) fetches.push(sutepaApi.get('familia', { signal: controller.signal }).then(res => ({ type: 'familia', data: res.data.data })))
        if (!documentacion.length) fetches.push(sutepaApi.get('documentacion', { signal: controller.signal }).then(res => ({ type: 'documentacion', data: res.data.data })))
        if (!subsidio.length) fetches.push(sutepaApi.get('subsidio', { signal: controller.signal }).then(res => ({ type: 'subsidio', data: res.data.data })))
        if (!sexo.length) fetches.push(sutepaApi.get('sexo', { signal: controller.signal }).then(res => ({ type: 'sexo', data: res.data.data })))
        if (!agrupamiento.length) fetches.push(sutepaApi.get('agrupamiento', { signal: controller.signal }).then(res => ({ type: 'agrupamiento', data: res.data.data })))
        if (!seccional.length) fetches.push(sutepaApi.get('seccionalAll', { signal: controller.signal }).then(res => ({ type: 'seccional', data: res.data.data })))
        if (!ugl.length) fetches.push(sutepaApi.get('ugl', { signal: controller.signal }).then(res => ({ type: 'ugl', data: res.data.data })))
        if (!tramo.length) fetches.push(sutepaApi.get('tramo', { signal: controller.signal }).then(res => ({ type: 'tramo', data: res.data.data })))

        // Ejecuta las peticiones
        const results = await Promise.all(fetches)

        // Actualiza el estado
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
    dispatch, legajos.length, estadoCivil.length, provincia.length, nacionalidad.length, familia.length, documentacion.length, subsidio.length, sexo.length, agrupamiento.length, seccional.length, ugl.length, tramo.length
  ])

  return {
    legajos,
    estadoCivil,
    provincia,
    nacionalidad,
    familia,
    documentacion,
    subsidio,
    sexo,
    agrupamiento,
    seccional,
    ugl,
    tramo
  }
}

export default useFetchData
