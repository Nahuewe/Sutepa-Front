import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sutepaApi } from '@/api'
import { handleData, setErrorMessage } from '@/store/dataAfiliado'

const useFetchDocumentacion = () => {
  const dispatch = useDispatch()

  const {
    documentacion
  } = useSelector(state => state.dataAfiliado)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetches = []

        // Agrega las peticiones necesarias
        if (!documentacion.length) fetches.push(sutepaApi.get('documentacion').then(res => ({ type: 'documentacion', data: res.data.data })))

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
    dispatch, documentacion.length
  ])

  return {
    documentacion
  }
}

export default useFetchDocumentacion
