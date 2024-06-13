/* eslint-disable camelcase */
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { handleAfiliado, onUpdateAfiliado, setErrorMessage, onShowAfiliado, cleanAfiliado } from '@/store/afiliado'
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

  const startGetAfiliadosSinPaginar = async () => {
    try {
      const response = await sutepaApi.get('/personaAll')
      const { data } = response.data
      dispatch(onShowAfiliado(data))
    } catch (error) {
      console.log(error)
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
      console.log(response)
      navigate('/afiliados')
      dispatch(cleanAfiliado())

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

  const startEditAfiliado = async (id) => {
    try {
      const response = await sutepaApi.get(`/personas/${id}`)
      const { data } = response.data
      dispatch(onShowAfiliado(data))
    } catch (error) {
      console.log(error)
    }
  }

  const startUpdateAfiliado = async () => {
    try {
      const { id } = activeAfiliado
      const response = await sutepaApi.put(`/personas/${id}`)
      const { data } = response
      dispatch(onUpdateAfiliado(data))
      navigate('/afiliados')

      toast.success('Afiliado editado con éxito')
    } catch (error) {
      toast.error('No se pudo editar los datos')
    }
  }

  const startDeleteAfiliado = async () => {
    try {
      await sutepaApi.delete(`/personas/${activeAfiliado.id}`)
      startLoadingAfiliado()

      let message = ''

      switch (activeAfiliado.estado) {
        case 'PENDIENTE':
          message = 'Afiliado aprobado con éxito'
          break
        case 'ACTIVO':
          message = 'Afiliado dado de baja con éxito'
          break
        case 'INACTIVO':
          message = 'Afiliado reactivado con éxito'
          break
        default:
          break
      }

      toast.success(message)
    } catch (error) {
      toast.error('No se pudo eliminar los datos')
    }
  }

  const startSearchAfiliado = async (search, page = 1) => {
    try {
      const response = await sutepaApi.get(`/buscar-persona/${search}?page=${page}`)
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
    startGetAfiliadosSinPaginar,
    startEditAfiliado,
    startSavingAfiliado,
    startUpdateAfiliado,
    startDeleteAfiliado,
    startSearchAfiliado
  }
}
