import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { sutepaApi } from '../api'
import { handleData, setErrorMessage } from '../store/dataAfiliado'

const useFetchData = () => {
  const dispatch = useDispatch()

  // Selecciona el estado de Redux
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
    const fetchData = async () => {
      try {
        const fetches = []

        // Agrega las peticiones necesarias
        if (!legajos.length) fetches.push(sutepaApi.get('legajos').then(res => ({ type: 'legajos', data: res.data })))
        if (!estadoCivil.length) fetches.push(sutepaApi.get('estadocivil').then(res => ({ type: 'estadoCivil', data: res.data.data })))
        if (!provincia.length) fetches.push(sutepaApi.get('provincia').then(res => ({ type: 'provincia', data: res.data.data })))
        if (!nacionalidad.length) fetches.push(sutepaApi.get('nacionalidad').then(res => ({ type: 'nacionalidad', data: res.data.data })))
        if (!familia.length) fetches.push(sutepaApi.get('familia').then(res => ({ type: 'familia', data: res.data.data })))
        if (!documentacion.length) fetches.push(sutepaApi.get('documentacion').then(res => ({ type: 'documentacion', data: res.data.data })))
        if (!subsidio.length) fetches.push(sutepaApi.get('subsidio').then(res => ({ type: 'subsidio', data: res.data.data })))
        if (!sexo.length) fetches.push(sutepaApi.get('sexo').then(res => ({ type: 'sexo', data: res.data.data })))
        if (!agrupamiento.length) fetches.push(sutepaApi.get('agrupamiento').then(res => ({ type: 'agrupamiento', data: res.data.data })))
        if (!seccional.length) fetches.push(sutepaApi.get('seccionalAll').then(res => ({ type: 'seccional', data: res.data.data })))
        if (!ugl.length) fetches.push(sutepaApi.get('ugl').then(res => ({ type: 'ugl', data: res.data.data })))
        if (!tramo.length) fetches.push(sutepaApi.get('tramo').then(res => ({ type: 'tramo', data: res.data.data })))

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
