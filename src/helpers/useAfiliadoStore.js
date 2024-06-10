/* eslint-disable camelcase */
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { handleAfiliado, onDeleteAfiliado, onUpdateAfiliado, setActiveAfiliado, setErrorMessage } from '@/store/afiliado'
import { sutepaApi } from '../api'
import { useNavigate } from 'react-router-dom'

export const useAfiliadoStore = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { afiliados, paginate, activeAfiliado, persona, domicilio, datos_laborales, obra_social, documentacion, familiares, subsidios } = useSelector(state => state.afiliado)

  const startLoadingAfiliado = async (page) => {
    try {
      const response = await sutepaApi.get(`/personas?page=${page}`)
      const { data, meta } = response.data
      dispatch(handleAfiliado({ data, meta }))
    } catch (error) {
      console.log(error)
    }
  }

  const startLoadingActiveAfiliado = async (id) => {
    try {
      const response = await sutepaApi.get(`/personas/${id}`)
      const { data } = response.data
      dispatch(setActiveAfiliado(data))
    } catch (error) {
      console.error('No se pudo cargar el afiliado activo:', error)
    }
  }

  const startSavingAfiliado = async () => {
    try {
      const afiliado = {
        persona,
        domicilio,
        datos_laborales,
        obra_social,
        documentacion,
        familiares,
        subsidios
      }

      const response = await sutepaApi.post('/personas', afiliado)
      navigate('/afiliados')
      // dispatch(clearCargaActa())

      toast.success('Afiliado agregado con éxito')
    } catch (error) {
      let errorMessage = 'Error desconocido'
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors
        const firstErrorKey = Object.keys(errors)[0]
        errorMessage = errors[firstErrorKey][0]
      } else {
        errorMessage = error.message
      }

      console.error('Error en la carga de Afiliado:', errorMessage)
      dispatch(setErrorMessage(errorMessage))
      toast.error(`No se pudo agregar los datos: ${errorMessage}`)
    }
  }

  const startUpdateAfiliado = async () => {
    try {
      const { id } = activeAfiliado
      const response = await sutepaApi.put(`/personas/1`)
      const { data } = response.data
      dispatch(onUpdateAfiliado(data))
      dispatch(setActiveAfiliado(data))
      navigate('/afiliados')

      toast.success('Afiliado editado con éxito')
    } catch (error) {
      toast.error('No se pudo editar los datos')
    }
  }

  const startDeleteAfiliado = async () => {
    try {
      const { id } = activeAfiliado
      const response = await sutepaApi.delete(`/personas/1`)
      const { data } = response
      dispatch(onDeleteAfiliado(data))
      dispatch(setActiveAfiliado(data))
      startLoadingAfiliado()

      toast.success('Afiliado dado de baja con éxito')
    } catch (error) {
      toast.error('No se pudo eliminar los datos')
    }
  }

  const startSearchAfiliado = async (search, page = 1) => {
    try {
      const response = await sutepaApi.get(`/personas/buscar/${search}?page=${page}`)
      const { data, meta } = response.data
      dispatch(handleAfiliado({ data, meta }))
    } catch (error) {
      console.log(error)
    }
  }

  return {
    // Propiedades
    afiliados,
    paginate,
    activeAfiliado,

    // Métodos
    startLoadingAfiliado,
    startLoadingActiveAfiliado,
    startSavingAfiliado,
    startUpdateAfiliado,
    startDeleteAfiliado,
    startSearchAfiliado
  }
}
