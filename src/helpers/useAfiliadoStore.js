import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { handleAfiliado, onDeleteAfiliado, onUpdateAfiliado } from '@/store/afiliado'
import { sutepaApi } from '../api'
import { setActiveAfiliado } from '../store/afiliado'

export const useAfiliadoStore = () => {
  const dispatch = useDispatch()
  const { afiliados, paginate, activeAfiliado } = useSelector(state => state.afiliado)

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

  const startSavingAfiliado = async (data) => {
    try {
      const afiliado = {
        ...data,
        persona,
        datos_laborales,
        obra_social,
        documentacion,
        familiares,
        subsidios
      }

      const response = await sutepaApi.post('/personas', afiliado)
      console.log(response)
      navigate('/afiliados')
      // dispatch(clearCargaActa())

      toast.success('Afiliado agregado con exito')
    } catch (error) {
      console.error('Error saving ingreso:', error.response ? error.response.data : error.message)
      toast.error('No se pudo agregar los datos')
    }
  }

  const startUpdateAfiliado = async () => {
    try {
      const { id } = activeAfiliado
      const response = await sutepaApi.put(`/personas/${id}`)
      const { data } = response
      dispatch(onUpdateAfiliado(data))

      toast.success('Afiliado editado con éxito')
    } catch (error) {
      toast.error('No se pudo editar los datos')
    }
  }

  const startDeleteAfiliado = async () => {
    try {
      const { id } = activeAfiliado
      const response = await sutepaApi.delete(`/personas/${id}`)
      const { data } = response
      dispatch(onDeleteAfiliado(data))

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
