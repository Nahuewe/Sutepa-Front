import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sutepaApi } from '@/api'
import { handleData, setErrorMessage } from '@/store/dataAfiliado'

const useFetchDomicilio = () => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const {
    provincia
  } = useSelector(state => state.dataAfiliado)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetches = []

        // Agrega las peticiones necesarias
        if (!provincia.length) fetches.push(sutepaApi.get('provincia').then(res => ({ type: 'provincia', data: res.data.data })))

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
  }, [dispatch, provincia.length])

  return {
    provincia,
    isLoading
  }
}

export default useFetchDomicilio
