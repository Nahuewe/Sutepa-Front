/* eslint-disable no-unused-vars */
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { handleAgencia, handleAgenciaSinpaginar, setErrorMessage } from '@/store/agencia'
import { handleShowEdit, handleShowModal } from '@/store/layout'
import { sutepaApi } from '../api'
import { useState } from 'react'

export const useAgenciaStore = () => {
  const { agencias, agenciasSinPaginar, paginate, activeAgencia } = useSelector(state => state.agencia)
  const [currentPage, setCurrentPage] = useState(1)
  const dispatch = useDispatch()

  const startLoadingAgencia = async (page = 1) => {
    try {
      const response = await sutepaApi.get(`/agencia?page=${page}`)
      const { data, meta } = response.data
      dispatch(handleAgencia({ data, meta }))
      setCurrentPage(page)
    } catch (error) {
      console.log(error)
    }
  }

  const startGetAgenciasSinPaginar = async () => {
    try {
      const response = await sutepaApi.get('/agenciaAll')
      const { data } = response.data
      dispatch(handleAgenciaSinpaginar(data))
    } catch (error) {
      console.log(error)
    }
  }

  const startSavingAgencia = async (form) => {
    try {
      const response = await sutepaApi.post('/agencia', form)
      await startLoadingAgencia(currentPage)
      dispatch(handleShowModal())

      toast.success('Agencia agregada con exito')
    } catch (error) {
      let errorMessage = 'Error desconocido'
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors
        const firstErrorKey = Object.keys(errors)[0]
        errorMessage = errors[firstErrorKey][0]
      } else {
        errorMessage = error.message
      }

      console.error('Error en la actualización de la agencia:', errorMessage)
      dispatch(setErrorMessage(errorMessage))
      toast.error(`No se pudo crear la agencia: ${errorMessage}`)
    }
  }

  const startUpdateAgencia = async (form) => {
    try {
      const id = activeAgencia.id
      const response = await sutepaApi.put(`/agencia/${id}`, form)
      const { data } = response.data
      await startLoadingAgencia(currentPage)
      dispatch(handleShowEdit())

      toast.success('Agencia actualizada con exito')
    } catch (error) {
      let errorMessage = 'Error desconocido'
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors
        const firstErrorKey = Object.keys(errors)[0]
        errorMessage = errors[firstErrorKey][0]
      } else {
        errorMessage = error.message
      }

      console.error('Error en la actualización de la agencia:', errorMessage)
      dispatch(setErrorMessage(errorMessage))
      toast.error(`No se pudo editar la agencia: ${errorMessage}`)
    }
  }

  const startDeleteAgencia = async () => {
    try {
      const id = activeAgencia.id
      await sutepaApi.delete(`/agencia/${id}`)
      await startLoadingAgencia(currentPage)

      toast.success('Agencia eliminada con exito')
    } catch (error) {
      toast.error('No se pudo realizar la operación')
    }
  }

  const startSearchAgencia = async (search, page = 1) => {
    try {
      const response = await sutepaApi.get(`/buscar-agencia?query=${search}&page=${page}`)
      const { data, meta } = response.data
      dispatch(handleAgencia({ data, meta }))
    } catch (error) {
      let errorMessage = 'Error desconocido'
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message
      } else {
        errorMessage = error.message
      }

      console.error('Error en la búsqueda de agencia:', errorMessage)
      toast.error(`No se pudo realizar la búsqueda: ${errorMessage}`)
    }
  }

  return {
    //* Propiedades
    agencias,
    agenciasSinPaginar,
    paginate,
    activeAgencia,

    //* Metodos
    startLoadingAgencia,
    startGetAgenciasSinPaginar,
    startSavingAgencia,
    startDeleteAgencia,
    startUpdateAgencia,
    startSearchAgencia
  }
}
