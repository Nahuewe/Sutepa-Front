/* eslint-disable no-unused-vars */
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { handleSeccional, handleSeccionalSinpaginar, setErrorMessage } from '@/store/seccional'
import { handleShowEdit, handleShowModal } from '@/store/layout'
import { sutepaApi } from '../api'

export const useSeccionalStore = () => {
  const { seccionales, seccionalesSinPaginar, paginate, activeSeccional } = useSelector(state => state.seccional)
  const dispatch = useDispatch()

  const startLoadingSeccional = async (page) => {
    try {
      const response = await sutepaApi.get(`/seccional?page=${page}`)
      const { data, meta } = response.data
      dispatch(handleSeccional({ data, meta }))
    } catch (error) {
      console.log(error)
    }
  }

  const startGetSeccionalesSinPaginar = async () => {
    try {
      const response = await sutepaApi.get('/seccionalAll')
      const { data } = response.data
      dispatch(handleSeccionalSinpaginar(data))
    } catch (error) {
      console.log(error)
    }
  }

  const startSavingSeccional = async (form) => {
    try {
      const response = await sutepaApi.post('/seccional', form)
      startLoadingSeccional()
      dispatch(handleShowModal())

      toast.success('Seccional agregada con exito')
    } catch (error) {
      let errorMessage = 'Error desconocido'
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors
        const firstErrorKey = Object.keys(errors)[0]
        errorMessage = errors[firstErrorKey][0]
      } else {
        errorMessage = error.message
      }

      console.error('Error en la actualización de la seccional:', errorMessage)
      dispatch(setErrorMessage(errorMessage))
      toast.error(`No se pudo crear la seccional: ${errorMessage}`)
    }
  }

  const startUpdateSeccional = async (form) => {
    try {
      const id = activeSeccional.id
      const response = await sutepaApi.put(`/seccional/${id}`, form)
      const { data } = response.data
      startLoadingSeccional()
      dispatch(handleShowEdit())

      toast.success('Seccional actualizada con exito')
    } catch (error) {
      let errorMessage = 'Error desconocido'
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors
        const firstErrorKey = Object.keys(errors)[0]
        errorMessage = errors[firstErrorKey][0]
      } else {
        errorMessage = error.message
      }

      console.error('Error en la actualización de la seccional:', errorMessage)
      dispatch(setErrorMessage(errorMessage))
      toast.error(`No se pudo editar la seccional: ${errorMessage}`)
    }
  }

  const startDeleteSeccional = async () => {
    try {
      const id = activeSeccional.id
      await sutepaApi.delete(`/seccional/${id}`)
      startLoadingSeccional()

      toast.success('Seccional eliminada con exito')
    } catch (error) {
      toast.error('No se pudo realizar la operación')
    }
  }

  const startSearchSeccional = async (search, page = 1) => {
    try {
      const response = await sutepaApi.get(`/buscar-seccional?query=${search}&page=${page}`)
      const { data, meta } = response.data
      dispatch(handleSeccional({ data, meta }))
    } catch (error) {
      let errorMessage = 'Error desconocido'
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message
      } else {
        errorMessage = error.message
      }

      console.error('Error en la búsqueda de seccional:', errorMessage)
      toast.error(`No se pudo realizar la búsqueda: ${errorMessage}`)
    }
  }

  return {
    //* Propiedades
    seccionales,
    seccionalesSinPaginar,
    paginate,
    activeSeccional,

    //* Metodos
    startLoadingSeccional,
    startGetSeccionalesSinPaginar,
    startSavingSeccional,
    startDeleteSeccional,
    startUpdateSeccional,
    startSearchSeccional
  }
}
