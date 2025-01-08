import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { sutepaApi } from '@/api'
import { handleData, setErrorMessage } from '@/store/dataAfiliado'

const useFetchSubsidio = () => {
  const dispatch = useDispatch()

  const {
    subsidio
  } = useSelector(state => state.dataAfiliado)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetches = []

        // Agrega las peticiones necesarias
        if (!subsidio.length) fetches.push(sutepaApi.get('subsidio').then(res => ({ type: 'subsidio', data: res.data.data })))

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
    dispatch, subsidio.length
  ])

  return {
    subsidio
  }
}

export default useFetchSubsidio
