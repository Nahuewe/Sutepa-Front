import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { sutepaApi } from '@/api'
import { handleData, setErrorMessage } from '@/store/dataAfiliado'

const useFetchDatosPersonales = () => {
  const dispatch = useDispatch()

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
  }, [
    dispatch, legajos.length, sexo.length, estadoCivil.length, nacionalidad.length
  ])

  return {
    legajos,
    sexo,
    estadoCivil,
    nacionalidad
  }
}

export default useFetchDatosPersonales
