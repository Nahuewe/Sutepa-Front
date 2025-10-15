import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sutepaApi } from '@/api'
import { handleData, setErrorMessage } from '@/store/dataAfiliado'

const useFetchDomicilio = () => {
  const dispatch = useDispatch()

  const {
    provincia
  } = useSelector(state => state.dataAfiliado)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetches = []

        // Agrega las peticiones necesarias
        if (!provincia.length) fetches.push(sutepaApi.get('provincia').then(res => ({ type: 'provincia', data: res.data.data })))

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
    dispatch, provincia.length
  ])

  return {
    provincia
  }
}

export default useFetchDomicilio
