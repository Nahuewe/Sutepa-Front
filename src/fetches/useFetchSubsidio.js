import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sutepaApi } from '@/api'
import { handleData, setErrorMessage } from '@/store/dataAfiliado'

const useFetchSubsidio = () => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const {
    subsidio
  } = useSelector(state => state.dataAfiliado)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetches = []

        // Agrega las peticiones necesarias
        if (!subsidio.length) fetches.push(sutepaApi.get('subsidio').then(res => ({ type: 'subsidio', data: res.data.data })))

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
  }, [dispatch, subsidio.length])

  return {
    subsidio,
    isLoading
  }
}

export default useFetchSubsidio
