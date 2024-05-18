import { useSelector, useDispatch } from 'react-redux'
import { sutepaApi } from '../api'
import { handleSucursal, onAddNewSucursal, onDeleteSucursal, onUpdateSucursal } from '../store/sucursal'
import { toast } from 'react-toastify'

export const useSucursalStore = () => {
  const dispatch = useDispatch()
  const { sucursales, activeSucursal } = useSelector(state => state.sucursal)

  const startSavingSucursal = async ({ nombre }) => {
    try {
      const { data } = await sutepaApi.post('/sucursales/create', { nombre })
      dispatch(onAddNewSucursal(data.sucursal))

      toast.success('Sucursal agregada con exito')
    } catch (error) {
      toast.error('No se pudo agregar los datos')
    }
  }

  const startLoadingSucursales = async () => {
    try {
      const { data } = await sutepaApi.get('/sucursales')
      dispatch(handleSucursal(data.sucursales))
    } catch (error) {
      console.log(error)
    }
  }

  const startDeleteSucursal = async () => {
    try {
      const { id } = activeSucursal
      //   const { data } = await sutepaApi.delete(`/sucursales/delete/${id}`)
      dispatch(onDeleteSucursal(id))

      toast.success('Sucursal eliminada con exito')
    } catch (error) {
      toast.error('No se pudo modificar los datos')
    }
  }

  const startUpdateSucursal = async ({ nombre }) => {
    try {
      const { id } = activeSucursal
      const { data } = await sutepaApi.put(`/sucursales/update/${id}`, { nombre })
      dispatch(onUpdateSucursal(data.sucursal))

      toast.success('Sucursal actualizada con exito')
    } catch (error) {
      toast.error('No se pudo modificar los datos')
    }
  }

  return {
    //* Propiedades
    sucursales,
    activeSucursal,

    //* Metodos
    startSavingSucursal,
    startLoadingSucursales,
    startDeleteSucursal,
    startUpdateSucursal
  }
}
