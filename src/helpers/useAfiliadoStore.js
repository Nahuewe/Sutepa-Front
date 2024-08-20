/* eslint-disable camelcase */
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { handleAfiliado, handleAfiliadosSinPaginar, onUpdateAfiliado, setErrorMessage, onShowAfiliado, cleanAfiliado } from '@/store/afiliado'
import { sutepaApi } from '../api'
import { useNavigate } from 'react-router-dom'
import sendEmail from '../components/EmailJs'

export const useAfiliadoStore = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { afiliados, afiliadosSinPaginar, paginate, activeAfiliado, persona, domicilio, datos_laborales, obra_social, documentacion, familiares, subsidios } = useSelector(state => state.afiliado)

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
      dispatch(handleAfiliadosSinPaginar(data))
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

      // Envio de email
      const email = persona.email || ''
      const name = persona.nombre || ''
      const lastName = persona.apellido || ''

      if (email) {
        try {
          await sendEmail(
            email,
            name,
            lastName,
            email
          )
          toast.success('Correo enviado con éxito')
        } catch (error) {
          console.error('Error enviando el correo:', error)
          toast.error('No se pudo enviar el correo: ' + error.message)
        }
      } else {
        toast.error('No se pudo enviar el correo porque no existe')
      }

      navigate('/afiliados')
      startLoadingAfiliado()
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
      const currentPage = paginate?.current_page || 1
      const response = await sutepaApi.get(`/personas/${id}`)
      const { data } = response.data
      dispatch(onShowAfiliado(data, currentPage))
    } catch (error) {
      console.log(error)
    }
  }

  const startUpdateAfiliado = async (id) => {
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

      const response = await sutepaApi.put(`/personas/${id}`, afiliado)
      const { data } = response
      dispatch(onUpdateAfiliado(data))

      const searchParams = new URLSearchParams(window.location.search)
      const page = searchParams.get('page') || 1

      navigate(`/afiliados?page=${page}`)
      dispatch(cleanAfiliado())

      toast.success('Afiliado editado con éxito')
    } catch (error) {
      let errorMessage = 'Error desconocido'
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors
        const firstErrorKey = Object.keys(errors)[0]
        errorMessage = errors[firstErrorKey][0]
      } else {
        errorMessage = error.message
      }

      console.error('Error en la actualización de Afiliado:', errorMessage)
      dispatch(setErrorMessage(errorMessage))
      toast.error(`No se pudo editar los datos: ${errorMessage}`)
    }
  }

  const startDeleteAfiliado = async () => {
    try {
      const currentPage = paginate?.current_page || 1
      await sutepaApi.delete(`/personas/${activeAfiliado.id}`)
      startLoadingAfiliado(currentPage)
      startGetAfiliadosSinPaginar()

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
      toast.error('No se pudo cambiar el estado')
    }
  }

  const startSearchAfiliado = async (search, page = 1) => {
    try {
      const response = await sutepaApi.get(`/buscar-persona?query=${search}&page=${page}`)
      const { data, meta } = response.data
      dispatch(handleAfiliado({ data, meta }))
    } catch (error) {
      console.log(error)
    }
  }

  return {
    // Propiedades
    afiliados,
    afiliadosSinPaginar,
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
