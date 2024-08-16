/* eslint-disable no-unused-vars */
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { handleLocalidades, setErrorMessage } from '@/store/localidad'
import { handleShowEdit, handleShowModal } from '@/store/layout'
import { sutepaApi } from '../api'

export const useLocalidadStore = () => {
  const { localidades = [], paginate, activeLocalidad } = useSelector((state) => state.localidad)
  const dispatch = useDispatch()

  const startLoadingLocalidad = async (page = 1) => {
    try {
      const response = await sutepaApi.get(`/localidad?page=${page}`)
      const { data, meta } = response.data
      dispatch(handleLocalidades({ data, meta }))
    } catch (error) {
      console.log(error)
    }
  }

  const startSavingLocalidad = async (form) => {
    try {
      const response = await sutepaApi.post('/localidad', form)
      startLoadingLocalidad()
      dispatch(handleShowModal())

      toast.success('Localidad agregada con exito')
    } catch (error) {
      let errorMessage = 'Error desconocido'
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors
        const firstErrorKey = Object.keys(errors)[0]
        errorMessage = errors[firstErrorKey][0]
      } else {
        errorMessage = error.message
      }

      console.error('Error en la actualización de la localidad:', errorMessage)
      dispatch(setErrorMessage(errorMessage))
      toast.error(`No se pudo crear la localidad: ${errorMessage}`)
    }
  }

  const startUpdateLocalidad = async (form) => {
    try {
      const id = activeLocalidad.id
      const response = await sutepaApi.put(`/localidad/${id}`, form)
      const { data } = response.data
      startLoadingLocalidad()
      dispatch(handleShowEdit())

      toast.success('Localidad actualizada con exito')
    } catch (error) {
      let errorMessage = 'Error desconocido'
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors
        const firstErrorKey = Object.keys(errors)[0]
        errorMessage = errors[firstErrorKey][0]
      } else {
        errorMessage = error.message
      }

      console.error('Error en la actualización de la localidad:', errorMessage)
      dispatch(setErrorMessage(errorMessage))
      toast.error(`No se pudo editar la localidad: ${errorMessage}`)
    }
  }

  const startDeleteLocalidad = async () => {
    try {
      const id = activeLocalidad.id
      await sutepaApi.delete(`/localidad/${id}`)
      startLoadingLocalidad()

      toast.success('Localidad eliminada con exito')
    } catch (error) {
      toast.error('No se pudo realizar la operación')
    }
  }

  const startSearchLocalidad = async (search, page = 1) => {
    try {
      const response = await sutepaApi.get(`/buscar-localidad?query=${search}&page=${page}`)
      const { data, meta } = response.data
      dispatch(handleLocalidades({ data, meta }))
    } catch (error) {
      let errorMessage = 'Error desconocido'
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message
      } else {
        errorMessage = error.message
      }

      console.error('Error en la búsqueda de localidad:', errorMessage)
      toast.error(`No se pudo realizar la búsqueda: ${errorMessage}`)
    }
  }

  return {
    //* Propiedades
    localidades,
    paginate,
    activeLocalidad,

    //* Metodos
    startLoadingLocalidad,
    startSavingLocalidad,
    startUpdateLocalidad,
    startDeleteLocalidad,
    startSearchLocalidad
  }
}
