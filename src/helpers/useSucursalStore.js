import { useSelector, useDispatch } from 'react-redux'
import { sutepaApi } from '../api'
import { handleSeccional, onAddNewSeccional, onDeleteSeccional, onUpdatesSeccional } from '../store/sucursal'
import { toast } from 'react-toastify'

export const useSucursalStore = () => {
  const dispatch = useDispatch()
  const { seccionales, activeSeccional } = useSelector(state => state.seccional)

  const startSavingSeccional = async ({ nombre }) => {
    try {
      const { data } = await sutepaApi.post('/seccional/create', { nombre })
      dispatch(onAddNewSeccional(data.seccional))

      toast.success('Seccional agregada con exito')
    } catch (error) {
      toast.error('No se pudo agregar los datos')
    }
  }

  const startGetSeccional = async () => {
    try {
      const { data } = await sutepaApi.get('/seccional')
      dispatch(handleSeccional(data.seccionales))
    } catch (error) {
      console.log(error)
    }
  }

  const startDeleteSeccional = async () => {
    try {
      const { id } = activeSeccional
      //   const { data } = await sutepaApi.delete(`/seccional/delete/${id}`)
      dispatch(onDeleteSeccional(id))

      toast.success('Seccional eliminada con exito')
    } catch (error) {
      toast.error('No se pudo modificar los datos')
    }
  }

  const startUpdateSeccional = async ({ nombre }) => {
    try {
      const { id } = activeSeccional
      const { data } = await sutepaApi.put(`/seccional/update/${id}`, { nombre })
      dispatch(onUpdatesSeccional(data.seccional))

      toast.success('Seccional actualizada con exito')
    } catch (error) {
      toast.error('No se pudo modificar los datos')
    }
  }

  return {
    //* Propiedades
    seccionales,
    activeSeccional,

    //* Metodos
    startSavingSeccional,
    startGetSeccional,
    startDeleteSeccional,
    startUpdateSeccional
  }
}
